pipeline {
  agent any

  environment {
    REGISTRY_REPO = 'kanagaraj1998/kube-jenkins'
    KUBECONFIG = '/home/kanagu/.kube/config'
    TAG = "${env.BUILD_NUMBER}"
    DEPLOYMENT_FILE = 'client-1-k8s.yaml'  
  }

  stages {

    stage('Checkout Source Code') {
      steps {
        echo 'Checking out MERN-Proj repository...'
        git branch: 'qa', url: 'https://github.com/Kanagaraj77/MERN-Proj.git'
      }
    }

    stage('Docker Login') {
      steps {
        echo 'Logging into Docker Hub...'
        withCredentials([usernamePassword(
          credentialsId: 'docker-hub-creds',
          usernameVariable: 'DOCKER_USER',
          passwordVariable: 'DOCKER_PASS'
        )]) {
          sh '''
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
            echo "Docker login successful"
          '''
        }
      }
    }

    stage('Build Docker Images for Client-1') {
      steps {
        script {
          echo "Building Docker images for Client-1..."
          sh '''
            docker build -t client1-frontend:latest -f ./Client-1/client/DockerFile ./Client-1/client
            docker build -t client1-backend:latest -f ./Client-1/server/DockerFile ./Client-1/server
          '''
        }
      }
    }

    stage('Tag & Push Images') {
      steps {
        script {
          echo "Tagging and pushing Docker images..."
          sh '''
            docker tag client1-frontend:latest ${REGISTRY_REPO}:client1-frontend-${TAG}
            docker tag client1-backend:latest ${REGISTRY_REPO}:client1-backend-${TAG}

            docker push ${REGISTRY_REPO}:client1-frontend-${TAG}
            docker push ${REGISTRY_REPO}:client1-backend-${TAG}
          '''
        }
      }
    }

    stage('Deploy to Kubernetes Cluster') {
      steps {
        script {
          echo "Deploying updated images to Kubernetes..."

          sh '''
            echo "Updating Kubernetes manifests with new image tags..."

            sed -i "s|kanagaraj1998/kube-jenkins:client1-frontend-latest|${REGISTRY_REPO}:client1-frontend-${TAG}|g" ${DEPLOYMENT_FILE}
            sed -i "s|kanagaraj1998/kube-jenkins:client1-backend-latest|${REGISTRY_REPO}:client1-backend-${TAG}|g" ${DEPLOYMENT_FILE}

            echo "Applying updated Kubernetes manifests..."
            kubectl apply -f ${DEPLOYMENT_FILE}

            echo "Deployment successful!"
          '''
        }
      }
    }
  } 

  post {
    success {
      echo "Pipeline completed successfully! Images pushed and deployed with tag ${TAG}"
    }
    failure {
      echo "Pipeline failed. Check Jenkins logs for details."
    }
  }
}

