pipeline {
    agent any

    stages {
        stage('Install Dependencies') {
            steps {
                bat 'npm ci' 
                bat 'npx playwright install --with-deps'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                bat 'npx playwright test'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'playwright-report/**', 
                           allowEmptyArchive: true,
                           fingerprint: true

            archiveArtifacts artifacts: 'test-results/junit.xml', 
                           allowEmptyArchive: true

            junit testResults: 'test-results/junit.xml', 
                  allowEmptyResults: true,
                  keepLongStdio: true

            echo 'Тести завершено.'
        }
        success {
            echo 'Всі тести пройшли успішно!'
        }
        failure {
            echo 'Деякі тести впали.'
        }
    }
}
