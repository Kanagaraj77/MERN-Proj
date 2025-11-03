pipeline {
  agent {
    docker {
      image 'docker/compose:1.29.2'
      args '-v /var/run/docker.sock:/var/run/docker.sock'
    }
  }

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
      steps {
        sh 'docker-compose build'
      }
    }

    stage('Test') {
      steps {
        echo 'Running tests...'
        // Add actual test commands here, e.g., sh 'npm test'
      }
    }

    stage('Deploy') {
      steps {
        sh 'docker-compose down'
        sh 'docker-compose up -d'
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