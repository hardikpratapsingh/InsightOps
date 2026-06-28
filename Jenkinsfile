pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/hardikpratapsingh/InsightOps.git'
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                sh 'docker build -t insightops-backend ./backend'
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                sh 'docker build -t insightops-frontend ./frontend'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    cd ${WORKSPACE}
                    docker compose down || true
                    docker compose up -d
                '''
            }
        }

        stage('Verify') {
            steps {
                sh 'docker images | grep insightops'
            }
        }
    }
}
