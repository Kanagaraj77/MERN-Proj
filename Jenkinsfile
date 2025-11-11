pipeline {
  agent any

  environment {
    DOCKER_REGISTRY = 'kanagaraj1998/kube-jenkins'
    KUBECONFIG = '/var/lib/jenkins/.kube/config'
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

        sh "docker tag client1-frontend ${DOCKER_REGISTRY}:client1-frontend"
        sh "docker tag client1-backend ${DOCKER_REGISTRY}:client1-backend"

        sh "docker push ${DOCKER_REGISTRY}:client1-frontend"
        sh "docker push ${DOCKER_REGISTRY}:client1-backend"
      }
    }

    stage('Build & Push Client-2') {
      steps {
        echo "🔧 Building Docker images for Client-2..."

        sh "docker build -t client2-frontend -f ./Client-2/client/DockerFile ./Client-2/client"
        sh "docker build -t client2-backend -f ./Client-2/server/DockerFile ./Client-2/server"

        sh "docker tag client2-frontend ${DOCKER_REGISTRY}:client2-frontend"
        sh "docker tag client2-backend ${DOCKER_REGISTRY}:client2-backend"

        sh "docker push ${DOCKER_REGISTRY}:client2-frontend"
        sh "docker push ${DOCKER_REGISTRY}:client2-backend"
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        echo "🚀 Deploying Client-1 and Client-2 to Kubernetes..."

        // Create namespaces if they don’t exist
        sh '''
        kubectl get ns client1-namespace || kubectl create ns client1-namespace
        kubectl get ns client2-namespace || kubectl create ns client2-namespace
        '''

        // Replace image placeholders in YAML files
        sh '''
        sed -i "s|IMAGE_PLACEHOLDER_BACKEND_CLIENT1|${DOCKER_REGISTRY}:client1-backend|g" Client-1/client-1-k8s.yaml
        sed -i "s|IMAGE_PLACEHOLDER_FRONTEND_CLIENT1|${DOCKER_REGISTRY}:client1-frontend|g" Client-1/client-1-k8s.yaml

        sed -i "s|IMAGE_PLACEHOLDER_BACKEND_CLIENT2|${DOCKER_REGISTRY}:client2-backend|g" Client-2/client-2-k8s.yaml
        sed -i "s|IMAGE_PLACEHOLDER_FRONTEND_CLIENT2|${DOCKER_REGISTRY}:client2-frontend|g" Client-2/client-2-k8s.yaml
        '''

        // Apply manifests
        sh '''
        kubectl apply -f Client-1/client-1-k8s.yaml --namespace=client1-namespace --validate=false
        kubectl apply -f Client-2/client-2-k8s.yaml --namespace=client2-namespace --validate=false
        '''

        // Verify deployments
        sh '''
        kubectl get pods -n client1-namespace
        kubectl get pods -n client2-namespace
        '''
      }
    }
  }

  post {
    success {
      echo "✅ Deployment completed successfully for both Client-1 and Client-2!"
    }
    failure {
      echo "❌ Pipeline failed. Check Jenkins logs for details."
    }
  }
}
