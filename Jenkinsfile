pipeline {
    agent any

    stages {

        stage('Install') {
            steps {
                sh 'npm install'
                sh 'npx playwright install'
            }
        }

        stage('Run tests') {
            steps {
                sh 'npx playwright test'
            }
        }
    }

    post {
        always {
            publishHTML([
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'BananiZoo Report'
            ])
        }
    }
}
