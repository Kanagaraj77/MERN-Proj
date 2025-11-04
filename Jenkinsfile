pipeline {
  agent any

  environment {
    COMPOSE_FILE = 'docker-compose.yml'
  }
  environment {
    DOCKER_HOST = 'unix:///var/run/docker.sock'
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
        sh 'docker-compose build'
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