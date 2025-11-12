pipeline {
  agent any

  environment {
    REGISTRY_REPO = 'kanagaraj1998/kube-jenkins'
    KUBECONFIG = '/home/kanagu/.kube/config'
    BUILD_VERSION_FILE = 'version.txt'
    DEPLOYMENT_FILE = 'client-1-k8s.yaml'
  }

  stages {

    stage('Checkout Source Code') {
      steps {
        git branch: 'qa', url: 'https://github.com/Kanagaraj77/MERN-Proj.git'
      }
    }

    stage('Read or Create Version Tag') {
      steps {
        script {
          def version = fileExists(BUILD_VERSION_FILE) ? readFile(BUILD_VERSION_FILE).trim() : "v0"
          def versionNumber = version.replace("v", "").toInteger() + 1
          env.TAG = "v${versionNumber}"
          writeFile file: BUILD_VERSION_FILE, text: env.TAG
          echo "Using version tag: ${env.TAG}"
        }
      }
    }

    stage('Docker Login') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'docker-hub-creds',
          usernameVariable: 'DOCKER_USER',
          passwordVariable: 'DOCKER_PASS'
        )]) {
          sh '''
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
          '''
        }
      }
    }

    stage('Build Docker Images') {
      steps {
        sh '''
          docker build -t client1-frontend:latest ./Client-1/client
          docker build -t client1-backend:latest ./Client-1/server
        '''
      }
    }

    stage('Tag & Push Docker Images') {
      steps {
        sh '''
          docker tag client1-frontend:latest ${REGISTRY_REPO}:client1-frontend-${TAG}
          docker tag client1-backend:latest ${REGISTRY_REPO}:client1-backend-${TAG}

          docker push ${REGISTRY_REPO}:client1-frontend-${TAG}
          docker push ${REGISTRY_REPO}:client1-backend-${TAG}
        '''
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        sh '''
          # Replace image tags in YAML
          sed -i "s|kanagaraj1998/kube-jenkins:client1-frontend-latest|${REGISTRY_REPO}:client1-frontend-${TAG}|g" ${DEPLOYMENT_FILE}
          sed -i "s|kanagaraj1998/kube-jenkins:client1-backend-latest|${REGISTRY_REPO}:client1-backend-${TAG}|g" ${DEPLOYMENT_FILE}

          # Apply manifests
          kubectl --kubeconfig=${KUBECONFIG} apply -f ${DEPLOYMENT_FILE}
        '''
      }
    }
  }

  post {
    success {
      echo "Pipeline completed successfully! Images pushed and deployed with tag ${TAG}"
    }
    failure {
      echo "Pipeline failed. Check Jenkins logs."
    }
  }
}
