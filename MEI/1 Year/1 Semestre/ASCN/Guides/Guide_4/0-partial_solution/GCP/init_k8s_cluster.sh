echo "[MASTER|TASK 1] Starting K8 cluster"
sudo kubeadm init --pod-network-cidr=10.244.0.0/16 --apiserver-advertise-address=$1>> $HOME/kubeinit.log 2>&1

echo "[MASTER|TASK 2] Creating K8s directory"
mkdir -p $HOME/.kube

echo "[MASTER|TASK 3] Create Admin Configuration"
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config

echo "[MASTER|TASK 4] Configure flannel"
curl -s -o kube-flannel.yml https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
kubectl apply -f kube-flannel.yml

echo "[MASTER|TASK 5] Generate cluster join command"
echo "!!! Copy the following command and run on the worker nodes (with sudo) !!!"
kubeadm token create --print-join-command