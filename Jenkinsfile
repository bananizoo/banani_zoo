pipeline {
    agent any

    stages {

        stage('Install') {
            steps {
                bat 'npm install'
                bat 'npx playwright install'
            }
        }

        stage('Run tests') {
            steps {
                bat 'npx playwright test'
            }
        }
    }

    post {
        always {
            echo 'Tests finished'
        }
    }
}
