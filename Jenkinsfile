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

          // Ensure we have full history for diff comparison
          sh """
            git fetch --unshallow || true
            git fetch origin main
          """

          // Compare local HEAD with remote main to detect changed files
          def changedFilesRaw = sh(
            script: "git diff --name-only origin/main...HEAD || true",
            returnStdout: true
          ).trim()

          // Split lines safely
          def changedFiles = changedFilesRaw ? changedFilesRaw.split("\\n") : []
          echo "📄 Changed files: ${changedFiles}"

          // Detect which clients changed
          def client1Changed = changedFiles.any { it.startsWith('Client-1/') }
          def client2Changed = changedFiles.any { it.startsWith('Client-2/') }

          if (!client1Changed && !client2Changed) {
            error("⚠️ No client folder changes detected. Skipping build.")
          }

          // Save results to environment
          env.CLIENT1_CHANGED = client1Changed.toString()
          env.CLIENT2_CHANGED = client2Changed.toString()

          echo "✅ Client-1 changed: ${client1Changed}"
          echo "✅ Client-2 changed: ${client2Changed}"
        }
      }
    }

    // ===========================
    // Build & Deploy Client-1
    // ===========================
    stage('Build & Deploy Client-1') {
      when { expression { env.CLIENT1_CHANGED == 'true' } }
      steps {
        script {
          echo "🔧 Building Client-1..."
          sh "docker-compose -f docker-compose-client1.yml build"

          echo "🚀 Deploying Client-1..."
          sh "docker-compose -f docker-compose-client1.yml down"
          sh "docker-compose -f docker-compose-client1.yml up -d"
        }
      }
    }

    // ===========================
    // Build & Deploy Client-2
    // ===========================
    stage('Build & Deploy Client-2') {
      when { expression { env.CLIENT2_CHANGED == 'true' } }
      steps {
        script {
          echo "🔧 Building Client-2..."
          sh "docker-compose -f docker-compose-client2.yml build"

          echo "🚀 Deploying Client-2..."
          sh "docker-compose -f docker-compose-client2.yml down"
          sh "docker-compose -f docker-compose-client2.yml up -d"
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
