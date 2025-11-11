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
      steps {
        echo '🔐 Logging into Docker Hub...'
        withCredentials([usernamePassword(credentialsId: 'docker-hub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh '''
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
            if [ $? -ne 0 ]; then
              echo "❌ Docker login failed. Check credentials or network."
              exit 1
            fi
          '''
        }
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

    stage('Deploy to Kubernetes') {
      steps {
        echo "🚀 Deploying Client-1 to Kubernetes..."

        sh '''
          kubectl get ns client1-namespace || kubectl create ns client1-namespace

          sed -i "s|IMAGE_PLACEHOLDER_BACKEND_CLIENT1|${DOCKER_REGISTRY}:client1-backend-${TAG}|g" client-1-k8s.yaml
          sed -i "s|IMAGE_PLACEHOLDER_FRONTEND_CLIENT1|${DOCKER_REGISTRY}:client1-frontend-${TAG}|g" client-1-k8s.yaml

          kubectl apply -f client-1-k8s.yaml --namespace=client1-namespace --validate=false

          kubectl get pods -n client1-namespace
        '''
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
