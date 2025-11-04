pipeline {
  agent any

  environment {
    COMPOSE_FILE = 'docker-compose.yml'
  }

  stages {
    stage('Clone') {
      steps {
        git branch: 'main', url: 'https://github.com/Kanagaraj77/MERN-Proj.git'
      }
    }

    stage('Build') {
      agent {
        docker {
          image 'docker/compose:latest'
        }
      }
      steps {
        bat 'docker-compose build'
      }
    }

    stage('Test') {
      steps {
        echo 'Running tests...'
        // Add actual test commands here, e.g., bat 'npm test'
      }
    }

    stage('Deploy') {
      steps {
        bat 'docker-compose down'
        bat 'docker-compose up -d'
      }
    }
  }

  post {
    success {
      echo 'Pipeline completed successfully!'
    }
    failure {
      echo 'Pipeline failed. Please check the logs.'
    }
  }
}