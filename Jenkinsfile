pipeline {
  agent any

  environment {
    COMPOSE_FILE = 'docker-compose.yml'
  }

  stages {
    stage('Clone') {
      steps {
        git credentialsId: 'github-credentials', url: 'https://github.com/Kanagaraj77/MERN-Proj.git'
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
}

checkout([$class: 'GitSCM',
  branches: [[name: '*/main']],
  userRemoteConfigs: [[
    url: 'https://github.com/Kanagaraj77/MERN-Proj.git',
    credentialsId: 'github-credentials'
  ]]
])
