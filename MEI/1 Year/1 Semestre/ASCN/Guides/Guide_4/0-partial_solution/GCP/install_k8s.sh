echo "[ALL|Task 1] Update packages and install vim"
sudo apt update
sudo apt-get install -y vim

echo "[ALL|Task 2] Installing Docker"
sudo apt-get install docker.io -y
sudo sh -c "echo '{"exec-opts": ["native.cgroupdriver=systemd"]}' >> /etc/docker/daemon.json"

echo "[ALL|Task 3] Enable Docker"
sudo systemctl enable docker

echo "[ALL|Task 4] Restart Docker"
sudo systemctl restart docker

echo "[ALL|Task 5] Download Kubernetes"
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -

echo "[ALL|Task 6] Add repo of Kubernetes"
sudo apt-add-repository "deb https://apt.kubernetes.io/ kubernetes-xenial main"
sudo apt-get update

echo "[ALL|Task 7] Install Kubernetes"
sudo apt-get install -y kubeadm kubelet kubectl
sudo apt-mark hold kubeadm kubelet kubectl

echo "[ALL|Task 8] Disable swap"
sudo swapoff -a
sudo sed -i '/swap/d' /etc/fstab