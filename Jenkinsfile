pipeline {
  agent any

  environment {
    DOCKER_HOST = 'unix:///var/run/docker.sock'
    DOCKER_REGISTRY = 'kanagaraj1998'
    KUBECONFIG = '/var/lib/jenkins/.kube/config'
  }

  stages {
    stage('Checkout') {
      steps {
        echo '🔍 Cloning repository...'
        git branch: 'qa', url: 'https://github.com/Kanagaraj77/MERN-Proj.git'
      }
    }

    stage('Build & Push Client-1') {
      steps {
        echo "🔧 Building Docker images for Client-1..."

        dir('Client-1/client') {
          sh "docker build -t client1-frontend ."
        }
        dir('Client-1/server') {
          sh "docker build -t client1-backend ."
        }

        sh "docker tag client1-frontend ${DOCKER_REGISTRY}/client1-frontend:latest"
        sh "docker tag client1-backend ${DOCKER_REGISTRY}/client1-backend:latest"
        sh "docker push ${DOCKER_REGISTRY}/client1-frontend:latest"
        sh "docker push ${DOCKER_REGISTRY}/client1-backend:latest"
      }
    }

    stage('Build & Push Client-2') {
      steps {
        echo "🔧 Building Docker images for Client-2..."

        dir('Client-2/client') {
          sh "docker build -t client2-frontend ."
        }
        dir('Client-2/server') {
          sh "docker build -t client2-backend ."
        }

        sh "docker tag client2-frontend ${DOCKER_REGISTRY}/client2-frontend:latest"
        sh "docker tag client2-backend ${DOCKER_REGISTRY}/client2-backend:latest"
        sh "docker push ${DOCKER_REGISTRY}/client2-frontend:latest"
        sh "docker push ${DOCKER_REGISTRY}/client2-backend:latest"
      }
    }

    stage('Test') {
      steps {
        echo "🧪 Running tests for both clients..."
        // Add test commands here if needed
      }
    }

    stage('Deploy to Kubernetes - Client-1') {
      steps {
        echo "🚀 Deploying Client-1 to Kubernetes..."
        sh "kubectl apply -f K8s-Client-1/"
      }
    }

    stage('Deploy to Kubernetes - Client-2') {
      steps {
        echo "🚀 Deploying Client-2 to Kubernetes..."
        sh "kubectl apply -f K8s-Client-2/"
      }
    }
  }

  post {
    success {
      echo "✅ Pipeline completed successfully for both Client-1 and Client-2!"
    }
    failure {
      echo "❌ Pipeline failed. Check logs for details."
    }
  }
}
