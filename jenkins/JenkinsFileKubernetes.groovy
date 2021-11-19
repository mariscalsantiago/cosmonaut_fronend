podTemplate(containers:[
    containerTemplate(name: 'gradle', image: 'gradle:6.7.0-jdk11-hotspot', command: 'sleep', args: '99d'),
    containerTemplate(name: 'docker-registry', image: 'gcr.io/kaniko-project/executor:v1.6.0-debug', command: 'sleep', args: '99d'),
    containerTemplate(name: 'container-registry', image: 'gcr.io/google.com/cloudsdktool/cloud-sdk:327.0.0', command: 'sleep', args: '99d'),
    containerTemplate(name: 'protractor', image: 'wintermutetec/protractor:v5.4.x', command: 'sleep', args: '99d'),
    containerTemplate(name: 'angular', image: 'teracy/angular-cli:8.3', command: 'sleep', args: '99d')    
  ], volumes: [
  persistentVolumeClaim(mountPath: '/root/.m2/repository', claimName: 'maven-repo', readOnly: false),
  persistentVolumeClaim(mountPath: '/root/.gradle', claimName: 'gradle-repo', readOnly: false),
    secretVolume(secretName: 'k8s-sql-secret', mountPath: '/secret')
  ],envVars:[envVar(key:'GOOGLE_APPLICATION_CREDENTIALS',value:'/secret/cosmonaut-k8s-qa-sa_key.json')] ) {
  node(POD_LABEL) {
    stage("Compilacion") {
        container('angular'){
            script{
			   git url: 'https://github.com/ASG-BPM/cosmonaut-front',branch:'main',credentialsId: 'winter_user'
			   tag = sh(script:'git describe --tags --always `git rev-list --tags` | grep DEV | head -1',returnStdout: true ).trim()
			   sh "git checkout $tag"
			   sh 'npm install'
               sh 'ng build --prod --base-href /cosmonaut-front/'
		   }
        }
     }     
     stage('Deploy to GoogleStorage') {
        container('container-registry'){
            script{
                sh 'gcloud auth activate-service-account cosmonaut-k8s-qa-sa@cosmonaut-uat.iam.gserviceaccount.com --key-file=/secret/cosmonaut-k8s-qa-sa_key.json'
               sh "gcloud container clusters get-credentials qa-backend-cosmonaut --region=us-east1-b --project=cosmonaut-uat"
				sh 'cd dist/cosmonaut-front/ && gsutil cp -r *  gs://qa-cosmonaut-public-front/'		    
		     }
        }
     }
     }     
  }
  


