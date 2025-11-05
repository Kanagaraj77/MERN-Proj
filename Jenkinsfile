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
          // Get the last changed files from git
          def changedFiles = sh(script: "git diff --name-only HEAD~1 HEAD", returnStdout: true).trim().split("\n")
          echo "Changed files: ${changedFiles}"

          // Default to empty
          env.CLIENT = ""

          // Detect which client changed
          if (changedFiles.any { it.startsWith('Client-1/') }) {
            env.CLIENT = "Client-1"
          } else if (changedFiles.any { it.startsWith('Client-2/') }) {
            env.CLIENT = "Client-2"
          }

          if (env.CLIENT == "") {
            error "No changes detected in client1 or client2 folders. Skipping build."
          } else {
            echo "Detected change in ${env.CLIENT}"
          }
        }
      }
    }

    stage('Build') {
      when {
        expression { env.CLIENT != "" }
      }
      steps {
        dir("${env.CLIENT}") {
          echo "Building Docker images for ${env.CLIENT}..."
          sh 'docker-compose build'
        }
      }
    }

    stage('Test') {
      when {
        expression { env.CLIENT != "" }
      }
      steps {
        dir("${env.CLIENT}") {
          echo "Running tests for ${env.CLIENT}..."
          // Add test commands here, e.g.
          // sh 'npm test'
        }
      }
    }

    stage('Deploy') {
      when {
        expression { env.CLIENT != "" }
      }
      steps {
        script {
          dir("${env.CLIENT}") {
            echo "Deploying ${env.CLIENT}..."
            // Stop and restart containers for this client only
            sh 'docker-compose down'
            sh 'docker-compose up -d'
          }
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
