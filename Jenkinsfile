pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
            url: 'https://github.com/bananizoo/banani_zoo.git'
            }
        }

        stage('Install dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Run tests') {
            steps {
                bat 'npm test'
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished'
        }

        success {
            echo 'Tests executed successfully'
        }

        failure {
            echo 'Some tests failed'
        }
    }
}
