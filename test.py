from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time
import random

opt = Options()
opt.headless = False
opt.add_experimental_option("excludeSwitches", ["enable-logging"])


driver = webdriver.Chrome(options=opt)
driver.get("http://localhost/WebGL/")

# Para verificar se o site foi acessado corretamente
print("Executando: " + driver.title + "\n")

for i in range(10):
    # Intervalo usado no programa
    value = random.randrange(-30, 140)
    driver.execute_script("application2D.setAngle(" + str(value) +");")
    driver.execute_script("application2D.startSimulation();")

    while driver.execute_script("return !application2D.p.onGround();"):
        continue

    x1 = driver.execute_script("return Math.abs((application2D.projectile.transform.position.x - application2D.p.startPosition.x) / Physics.pixelPerMeters);")
    x2 = driver.execute_script("return application2D.maxDistance")

    l1 = driver.execute_script("return application2D.p.numericPathLenth")
    l2 = driver.execute_script("return application2D.pathLenth")

    print("Distancia medida: " + "{:.2f}".format(x1))
    print("Distancia caculada: " + "{:.2f}".format(x2))
    print("Erro: " + "{:.2f}".format(abs(x1 - x2)) + "\n")

    print("Tamanho medido: " + "{:.2f}".format(l1))
    print("Tamanho caculado: " + "{:.2f}".format(l2))
    print("Erro: " + "{:.2f}".format(abs(l1 - l2)) + "\n")

driver.close()