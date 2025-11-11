pipeline {
  agent any

  environment {
    DOCKER_REGISTRY = 'kanagaraj1998/kube-jenkins'
    KUBECONFIG = '/var/lib/jenkins/.kube/config'
    TAG = "${env.BUILD_NUMBER}" // Auto-incremented tag per Jenkins build
  }

  stages {

    stage('Checkout Code') {
      steps {
        echo '🔍 Cloning MERN-Proj repository...'
        git branch: 'qa', url: 'https://github.com/Kanagaraj77/MERN-Proj.git'
      }
    }

    stage('Docker Login') {
stage('Docker Login Test') {
  steps {
    sh '''
      docker logout || true
      echo "dckr_pat_Wk2UNjYO69iHEp7rm17018NMq-8" | docker login -u "kanagaraj1998" --password-stdin
      docker info
    '''
  }
}


    stage('Build & Push Client-1') {
      steps {
        echo "🔧 Building Docker images for Client-1..."

        sh "docker build -t client1-frontend -f ./Client-1/client/DockerFile ./Client-1/client"
        sh "docker build -t client1-backend -f ./Client-1/server/DockerFile ./Client-1/server"

        sh "docker tag client1-frontend ${DOCKER_REGISTRY}:client1-frontend-${TAG}"
        sh "docker tag client1-backend ${DOCKER_REGISTRY}:client1-backend-${TAG}"

        sh "docker push ${DOCKER_REGISTRY}:client1-frontend-${TAG}"
        sh "docker push ${DOCKER_REGISTRY}:client1-backend-${TAG}"
      }
    }


  } // ← closes the stages block

  post {
    success {
      echo "✅ Full pipeline completed successfully!"
    }
    failure {
      echo "❌ Pipeline failed. Check Jenkins logs for details."
    }
  }
} // ← closes the pipeline block

