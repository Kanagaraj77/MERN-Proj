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

    stage('Check Docker') {
      steps {
        script {
          if (isUnix()) {
            sh 'docker --version'
          } else {
            bat 'docker --version'
          }
        }
      }
    }

    stage('Build') {
      agent {
        docker {
          image 'docker/compose:latest'
        }
      }
      steps {
        script {
          if (isUnix()) {
            sh 'docker-compose build'
          } else {
            bat 'docker-compose build'
          }
        }
      }
    }

    stage('Test') {
      steps {
        echo 'Running tests...'
        // Add actual test commands here
      }
    }

    stage('Deploy') {
      steps {
        script {
          if (isUnix()) {
            sh 'docker-compose down'
            sh 'docker-compose up -d'
          } else {
            bat 'docker-compose down'
            bat 'docker-compose up -d'
          }
        }
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
