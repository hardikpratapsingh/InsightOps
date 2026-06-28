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

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG_FILE')]) {
                    sh '''
                        export KUBECONFIG=$KUBECONFIG_FILE

                        echo "========== Kubernetes Cluster =========="
                        kubectl get nodes

                        echo "========== Deploy PostgreSQL =========="
                        kubectl apply -f kubernetes/postgres.yaml

                        echo "========== Deploy Backend =========="
                        kubectl apply -f kubernetes/backend-deployment.yaml

                        echo "========== Deploy Frontend =========="
                        kubectl apply -f kubernetes/frontend-deployment.yaml

                        echo "========== Pods =========="
                        kubectl get pods

                        echo "========== Services =========="
                        kubectl get svc
                    '''
                }
            }
        }

        stage('Verify Docker Images') {
            steps {
                sh 'docker images | grep insightops'
            }
        }
    }

    post {

        success {
            echo '🎉 Deployment Successful!'
        }

        failure {
            echo '❌ Deployment Failed!'
        }

        always {
            echo 'Pipeline Finished.'
        }
    }
}
