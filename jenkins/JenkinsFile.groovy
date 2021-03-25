def tag=''
pipeline {
	agent {
		label 'docker-agent'
	}

	stages {
		stage("Protractor test") {
			agent{
				docker {
					label 'docker-agent'
                    image 'wintermutetec/protractor:v5.4.x'  
                    args "-e WEBDRIVER_VERSION=12.1.7 -e RUNDIR=${env.WORKSPACE} -u root"  
				}
			}
		   steps {
			   script{
				   git url: 'https://github.com/ASG-BPM/cosmonaut-front',branch:'main',credentialsId: 'winter_user'
				   tag = sh(script:'git describe --tags --always `git rev-list --tags` | grep DEV | head -1',returnStdout: true ).trim()
				   sh "git checkout $tag"
				   sh '/usr/bin/run_project.sh'
			   }
		   }
		   post {
				always{
                    publishHTML target: [
                        allowMissing: false,
                        alwaysLinkToLastBuild: false,
                        keepAll: true,
                        reportDir: 'e2e/reports',
                        reportFiles: 'report.html',
                        reportName: 'Protractor Report'
                      ]
                }
		   }
		}
		stage('Karma test') {
            agent{
                docker {
                    label 'docker-agent'
                    image 'teracy/angular-cli:8.3'
                    args '--dns 192.168.0.154'                    
                }
            }
            steps {
                script{
                    git url: 'https://github.com/ASG-BPM/cosmonaut-front',branch:'main',credentialsId: 'winter_user'
				    sh "git checkout $tag"
                    sh 'npm install'
                    sh 'npm run test-headless'
                }
            }
            post {
                always{
                    junit 'test-reports/**/*.xml'
                }
            }
        }
		stage('Sonarqube') {
			agent{
				docker {
					label 'docker-agent'
					image 'sonarsource/sonar-scanner-cli'
                    args "--dns 192.168.0.154  -e SONAR_HOST_URL='https://sonarqube.wintermute.services:9090'"
				}
			}
			steps{
				script{
				    git url: 'https://github.com/ASG-BPM/cosmonaut-front',branch:'main',credentialsId: 'winter_user'
				    sh "git checkout $tag"
				    sh "sonar-scanner -Dsonar.projectBaseDir=${env.WORKSPACE}"
				}
			}
		}
		stage('Build') {
            agent{
                docker {
                    label 'docker-agent'
                    image 'teracy/angular-cli:8.3'
                    args "--dns 192.168.0.154"                     
                }
            }
            steps {
                script{
                    git url: 'https://github.com/ASG-BPM/cosmonaut-front',branch:'main',credentialsId: 'winter_user'
				    sh "git checkout $tag"
                    sh 'npm install'
                    sh 'ng build --prod --base-href /cosmonaut-front/'
                    sh 'tar -cvzf dist.tar.gz dist'
                    stash includes: 'dist/cosmonaut-front/**/*', name:'distbuild'
                }
            }
            post {
                success {
                    archiveArtifacts artifacts: 'dist.tar.gz', fingerprint: true
                }
            }
        }
		stage('Deploy to Google Storage') {
			agent{
				docker {
					label 'docker-agent'
					image 'gcr.io/google.com/cloudsdktool/cloud-sdk:327.0.0'
					args "--dns 192.168.0.154 -e HOME=/tmp -e TAG=$tag"
				}
			}
			steps{
				 script{
					 withCredentials([file(credentialsId: 'cosmonaut-k8s-sa', variable: 'serviceaccount')]) {
					   unstash 'distbuild'
					   sh 'gcloud auth activate-service-account cosmonaut-gke-deployer@cosmonaut-299500.iam.gserviceaccount.com --key-file=$serviceaccount'
					   sh 'cd dist/cosmonaut-front/ && gsutil cp -r *  gs://cosmonaut-public-front/'
					 }
				 }
			}
		}
	}
}

