pipeline {
  agent any

  environment {
    DOCKER_HOST = 'unix:///var/run/docker.sock'
  }

  stages {
    stage('Checkout') {
      steps {
        echo '📦 Cloning repository...'
        git branch: 'main', url: 'https://github.com/Kanagaraj77/MERN-Proj.git'
      }
    }

    stage('Detect Changed Clients') {
      steps {
        script {
          echo '🔍 Checking for changed client folders...'

          // Ensure we have at least 2 commits for comparison
          sh "git fetch --unshallow || true"

          // Compare last two commits to detect changes
          def changedFilesRaw = sh(
            script: "git diff --name-only HEAD~1 HEAD || true",
            returnStdout: true
          ).trim()

          def changedFiles = changedFilesRaw ? changedFilesRaw.split("\\n") : []
          echo "📄 Changed files: ${changedFiles}"

          // Detect changed clients
          def client1Changed = changedFiles.any { it.startsWith('Client-1/') }
          def client2Changed = changedFiles.any { it.startsWith('Client-2/') }

          if (!client1Changed && !client2Changed) {
            error("⚠️ No client folder changes detected. Skipping build.")
          }

          // Save results to pipeline variables (not env)
          currentBuild.description = "Client-1: ${client1Changed}, Client-2: ${client2Changed}"

          // Store booleans in local map for later
          def clientsToBuild = [:]

          if (client1Changed) {
            clientsToBuild['Client-1'] = {
              stage('Build & Deploy Client-1') {
                echo "🔧 Building Client-1..."
                sh "docker-compose -f docker-compose-client1.yml build"

                echo "🚀 Deploying Client-1..."
                sh "docker-compose -f docker-compose-client1.yml down"
                sh "docker-compose -f docker-compose-client1.yml up -d"
              }
            }
          }

          if (client2Changed) {
            clientsToBuild['Client-2'] = {
              stage('Build & Deploy Client-2') {
                echo "🔧 Building Client-2..."
                sh "docker-compose -f docker-compose-client2.yml build"

                echo "🚀 Deploying Client-2..."
                sh "docker-compose -f docker-compose-client2.yml down"
                sh "docker-compose -f docker-compose-client2.yml up -d"
              }
            }
          }

          // Run both builds in parallel if needed
          parallel clientsToBuild
        }
      }
    }
  }

  post {
    success {
      echo "✅ Pipeline completed successfully!"
    }
    failure {
      echo "❌ Pipeline failed. Please check the logs."
    }
  }
}
