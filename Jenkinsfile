pipeline {
  agent any

  environment {
    DOCKER_HOST = 'unix:///var/run/docker.sock'
  }

  stages {
    stage('Checkout') {
      steps {
        echo 'Cloning repository...'
        git branch: 'main', url: 'https://github.com/Kanagaraj77/MERN-Proj.git'
      }
    }

    stage('Detect Changed Client') {
      steps {
        script {
          // Compare last commit with previous commit
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
            // Optional: handle if both changed (skip or deploy both)
            echo "⚠️ Both client1 and client2 changed. Skipping automatic deploy to avoid overlap."
            currentBuild.result = 'SUCCESS'
            error("Multiple clients changed in same commit. Manual deployment required.")
          } else {
            echo "No changes in client folders. Skipping pipeline."
            currentBuild.result = 'SUCCESS'
            error("No relevant changes found.")
          }

          echo "Detected change in ${env.CLIENT}"
        }
      }
    }

    stage('Build') {
  when { expression { env.CLIENT != "" } }
  steps {
    script {
      def composeFile = env.CLIENT == 'client1' ? 'docker-compose-client1.yml' : 'docker-compose-client2.yml'
      sh "docker-compose -f ${composeFile} build"
    }
  }
}

stage('Deploy') {
  when { expression { env.CLIENT != "" } }
  steps {
    script {
      def composeFile = env.CLIENT == 'client1' ? 'docker-compose-client1.yml' : 'docker-compose-client2.yml'
      sh "docker-compose -f ${composeFile} down"
      sh "docker-compose -f ${composeFile} up -d"
    }
  }
  }
  }
  post {
    success {
      echo '✅ Pipeline completed successfully!'
    }
    failure {
      echo '❌ Pipeline failed. Please check logs.'
    }
  }
}
