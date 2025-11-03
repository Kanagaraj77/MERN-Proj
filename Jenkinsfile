pipeline {
  agent {
    label 'WindowsNode'
  }

  environment {
    COMPOSE_FILE = 'docker-compose.yml'
  }

  stages {
    stage('Clone') {
      steps {
        git branch: 'main', credentialsId: 'github-credentials', url: 'https://github.com/Kanagaraj77/MERN-Proj.git'
      }
    }

    stage('Build') {
      steps {
        bat 'docker-compose build'
      }
    }

    stage('Test') {
      steps {
        echo 'Running tests...'
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