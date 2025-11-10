pipeline {
  agent any

  environment {
    DOCKER_HOST = 'unix:///var/run/docker.sock'
    DOCKER_REGISTRY = 'kanagaraj1998'
  }

  stages {
    stage('Checkout') {
      steps {
        echo '🔍 Cloning repository...'
        git branch: 'qa', url: 'https://github.com/Kanagaraj77/MERN-Proj.git'
      }
    }

    stage('Detect Changed Client') {
      steps {
        script {
          def changedFiles = sh(script: "git diff --name-only HEAD~1 HEAD", returnStdout: true).trim().split("\n")
          echo "Changed files: ${changedFiles}"

          env.CLIENT = ""
          def client1Changed = changedFiles.any { it.startsWith('Client-1/') }
          def client2Changed = changedFiles.any { it.startsWith('Client-2/') }

          if (client1Changed && !client2Changed) {
            env.CLIENT = "Client-1"
          } else if (client2Changed && !client1Changed) {
            env.CLIENT = "Client-2"
          } else if (client1Changed && client2Changed) {
            error("❌ Both Client-1 and Client-2 changed. Please deploy separately.")
          } else {
            error("❌ No client folder changes detected. Skipping build.")
          }

          echo "✅ Detected change in ${env.CLIENT}"
        }
      }
    }

    stage('Set Paths and Compose File') {
      when { expression { env.CLIENT != "" } }
      steps {
        script {
          if (env.CLIENT == 'Client-1') {
            env.FRONTEND_PATH = './Client-1/client'
            env.BACKEND_PATH = './Client-1/server'
            env.COMPOSE_FILE = 'docker-compose-client1.yml'
            env.K8S_PATH = 'K8s-Client-1'
            env.CLIENT_NAME = 'client1'
          } else if (env.CLIENT == 'Client-2') {
            env.FRONTEND_PATH = './Client-2/client'
            env.BACKEND_PATH = './Client-2/server'
            env.COMPOSE_FILE = 'docker-compose-client2.yml'
            env.K8S_PATH = 'K8s-Client-2'
            env.CLIENT_NAME = 'client2'
          } else {
            error("Invalid CLIENT value: '${env.CLIENT}'")
          }

          echo "📦 Using compose file: ${env.COMPOSE_FILE}"
        }
      }
    }

    stage('Build Docker Images') {
      steps {
        echo "🔧 Building Docker images for ${env.CLIENT}..."
        sh "docker build -t ${env.CLIENT_NAME}-frontend ${env.FRONTEND_PATH}"
        sh "docker build -t ${env.CLIENT_NAME}-backend ${env.BACKEND_PATH}"
        sh "docker tag ${env.CLIENT_NAME}-frontend ${DOCKER_REGISTRY}/${env.CLIENT_NAME}-frontend:latest"
        sh "docker tag ${env.CLIENT_NAME}-backend ${DOCKER_REGISTRY}/${env.CLIENT_NAME}-backend:latest"
        sh "docker push ${DOCKER_REGISTRY}/${env.CLIENT_NAME}-frontend:latest"
        sh "docker push ${DOCKER_REGISTRY}/${env.CLIENT_NAME}-backend:latest"
      }
    }

    stage('Test') {
      steps {
        echo "🧪 Running tests for ${env.CLIENT}..."
        // Add test commands here if needed
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        echo "🚀 Deploying ${env.CLIENT} to Kubernetes..."
        sh "kubectl apply -f ${env.K8S_PATH}/"
      }
    }
  }

  post {
    success {
      echo "✅ ${env.CLIENT} pipeline completed successfully!"
    }
    failure {
      echo "❌ ${env.CLIENT} pipeline failed. Attempting rollback..."
      sh "kubectl rollout undo deployment/${env.CLIENT_NAME}-backend || true"
    }
  }
}
