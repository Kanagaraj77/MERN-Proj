pipeline {
  agent any

  environment {
    DOCKER_REGISTRY = 'kanagaraj1998'
    KUBECONFIG = '/var/lib/jenkins/.kube/config'
  }

  stages {
    stage('Checkout') {
      steps {
        echo '🔍 Cloning repository...'
        git branch: 'qa', url: 'https://github.com/Kanagaraj77/MERN-Proj.git'
        sh 'pwd && ls -la'
      }
    }

    stage('Build Client-1 Images') {
      steps {
        echo "🔧 Building Docker images for Client-1..."
        sh 'ls -la Client-1/client Client-1/server || true'
        sh "docker build -t client1-frontend -f ./Client-1/client/Dockerfile ./Client-1/client"
        sh "docker build -t client1-backend  -f ./Client-1/server/Dockerfile ./Client-1/server"
      }
    }

    stage('Build Client-2 Images') {
      steps {
        echo "🔧 Building Docker images for Client-2..."
        // Use relative paths (no leading slash)
        sh "docker build -t client2-frontend -f ./Client-2/client/Dockerfile ./Client-2/client"
        sh "docker build -t client2-backend  -f ./Client-2/server/Dockerfile ./Client-2/server"
      }
    }

    stage('Docker Login & Push') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-cred', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'

          // tag with registry username and push
          sh "docker tag client1-frontend ${DOCKER_REGISTRY}/client1-frontend:latest"
          sh "docker tag client1-backend  ${DOCKER_REGISTRY}/client1-backend:latest"
          sh "docker tag client2-frontend ${DOCKER_REGISTRY}/client2-frontend:latest"
          sh "docker tag client2-backend  ${DOCKER_REGISTRY}/client2-backend:latest"

          sh "docker push ${DOCKER_REGISTRY}/client1-frontend:latest"
          sh "docker push ${DOCKER_REGISTRY}/client1-backend:latest"
          sh "docker push ${DOCKER_REGISTRY}/client2-frontend:latest"
          sh "docker push ${DOCKER_REGISTRY}/client2-backend:latest"
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        echo "🚀 Deploying Client-1 & Client-2 to Kubernetes..."
        // Option A: apply manifests that already reference your registry images
        sh "kubectl apply -f K8s-Client-1/ --kubeconfig=${KUBECONFIG}"
        sh "kubectl apply -f K8s-Client-2/ --kubeconfig=${KUBECONFIG}"

        // Option B: or explicitly update Deployments to use pushed images (uncomment if you prefer)
        // sh "kubectl -n client1-namespace set image deployment/backend-client1 backend=${DOCKER_REGISTRY}/client1-backend:latest --kubeconfig=${KUBECONFIG}"
        // sh "kubectl -n client1-namespace set image deployment/frontend-client1 frontend=${DOCKER_REGISTRY}/client1-frontend:latest --kubeconfig=${KUBECONFIG}"
      }
    }
  }

  post {
    success {
      echo "✅ Pipeline completed successfully!"
    }
    failure {
      echo "❌ Pipeline failed. Check logs for details."
    }
  }
}
