pipeline {
    agent any

    stages {

        stage('Install') {
            steps {
                bat 'npm install'
            }
        }

        stage('Test') {
            steps {
                bat 'npm test'
            }
        }
    }

    post {
        always {
            echo 'Tests finished'
        }
        success {
            echo 'All tests passed'
        }
        failure {
            echo 'Some tests failed'
        }
    }
}
