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
          // Get changed files
          def changedFiles = sh(script: "git diff --name-only HEAD~1 HEAD", returnStdout: true).trim().split("\n")
          echo "Changed files: ${changedFiles}"

          // Reset client var
          env.CLIENT = ""

          def client1Changed = changedFiles.any { it.startsWith('Client-1/') }
          def client2Changed = changedFiles.any { it.startsWith('Client-2/') }

          if (client1Changed && !client2Changed) {
            env.CLIENT = "Client-1"
          } else if (client2Changed && !client1Changed) {
            env.CLIENT = "Client-2"
          } else if (client1Changed && client2Changed) {
            error("Both Client-1 and Client-2 changed in the same commit. Please deploy separately.")
          } else {
            error("No client folder changes detected. Skipping build.")
          }

          echo "Detected change in ${env.CLIENT}"
        }
      }
    }

    stage('Select Compose File') {
      when { expression { env.CLIENT != "" } }
      steps {
        script {
          if (env.CLIENT == 'Client-1') {
            env.COMPOSE_FILE = 'docker-compose-client1.yml'
          } else if (env.CLIENT == 'Client-2') {
            env.COMPOSE_FILE = 'docker-compose-client2.yml'
          } else {
            error("Invalid CLIENT value: '${env.CLIENT}' — must be 'Client-1' or 'Client-2'")
          }

          echo "Using compose file: ${env.COMPOSE_FILE}"
        }
      }
    }

    stage('Build') {
      when { expression { env.CLIENT != "" } }
      steps {
        echo "🔧 Building ${env.CLIENT}..."
        sh "docker-compose -f ${env.COMPOSE_FILE} build"
      }
    }

    stage('Test') {
      when { expression { env.CLIENT != "" } }
      steps {
        echo " Running tests for ${env.CLIENT}..."
        // Add test commands if needed, e.g.:
        // sh "docker-compose -f ${env.COMPOSE_FILE} run --rm backend npm test"
      }
    }

    stage('Deploy') {
      when { expression { env.CLIENT != "" } }
      steps {
        echo " Deploying ${env.CLIENT}..."
        sh "docker-compose -f ${env.COMPOSE_FILE} down"
        sh "docker-compose -f ${env.COMPOSE_FILE} up -d"
      }
    }
  }

  post {
    success {
      echo " ${env.CLIENT} pipeline completed successfully!"
    }
    failure {
      echo " ${env.CLIENT} pipeline failed. Please check the logs."
    }
  }
}