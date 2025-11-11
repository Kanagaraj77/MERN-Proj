pipeline {
  agent any

  environment {
    REGISTRY_REPO = 'kanagaraj1998/kube-jenkins'
    KUBECONFIG = '/var/lib/jenkins/.kube/config'   // Ensure this points to your Minikube config
    TAG = "${env.BUILD_NUMBER}"
    DEPLOYMENT_PATH = './k8s'
  }

  stages {

    stage('Checkout Source Code') {
      steps {
        echo '🔍 Checking out MERN-Proj repository...'
        git branch: 'qa', url: 'https://github.com/Kanagaraj77/MERN-Proj.git'
      }
    }

    stage('Set up Minikube Docker Environment') {
      steps {
        echo '⚙️ Setting up Docker environment for Minikube...'
        sh '''
          eval $(minikube docker-env)
          echo "✅ Docker environment set to Minikube"
        '''
      }
    }

    stage('Build Docker Images for Client-1') {
      steps {
        script {
          echo "🔧 Building Docker images for Client-1 inside Minikube Docker daemon..."
          sh '''
            docker build -t ${REGISTRY_REPO}:client1-frontend-${TAG} -f ./Client-1/client/DockerFile ./Client-1/client
            docker build -t ${REGISTRY_REPO}:client1-backend-${TAG} -f ./Client-1/server/DockerFile ./Client-1/server
          '''
        }
      }
    }

    stage('Deploy to Minikube Kubernetes Cluster') {
      steps {
        script {
          echo "🚀 Deploying updated images to Minikube..."
          
          sh '''
            echo "🔁 Updating Kubernetes manifests with new image tags..."

            # Replace image placeholders dynamically
            sed -i "s|kanagaraj1998/kube-jenkins:client1-frontend-latest|${REGISTRY_REPO}:client1-frontend-${TAG}|g" ${DEPLOYMENT_PATH}/client1-deployment.yaml
            sed -i "s|kanagaraj1998/kube-jenkins:client1-backend-latest|${REGISTRY_REPO}:client1-backend-${TAG}|g" ${DEPLOYMENT_PATH}/client1-deployment.yaml

            echo "📄 Applying updated Kubernetes manifests..."
            kubectl apply -f ${DEPLOYMENT_PATH}/client1-deployment.yaml

            echo "⏳ Waiting for rollouts..."
            kubectl rollout status deployment/client1-frontend-deployment -n client1-namespace
            kubectl rollout status deployment/client1-backend-deployment -n client1-namespace

            echo "✅ Deployment successful on Minikube!"
          '''
        }
      }
    }

    stage('Access Info') {
      steps {
        echo '🌐 Fetching Minikube service URL for frontend...'
        sh '''
          echo "Frontend Service URL:"
          minikube service client1-frontend-service -n client1-namespace --url
        '''
      }
    }

  } // end stages

  post {
    success {
      echo "✅ Pipeline completed successfully! Images built and deployed to Minikube with tag ${TAG}"
    }
    failure {
      echo "❌ Pipeline failed. Check Jenkins logs for details."
    }
    always {
      echo "🕒 Pipeline finished at: (date)"
    }
  }
}
