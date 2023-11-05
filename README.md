## Heart-beat monitor - Plus

Um simulador de monitor cardíaco, usando Node.js, MongoDB e Docker.
Há um serviço hbm-simulator que se comunica com o hbm-analyzer via gRPC, o simulador envia as medidas para o analisador, que envia os dados para o MongoDB.

Diagrama:
![Screenshot from 2023-11-04 16-03-46](https://github.com/henrezende/hbmplus/assets/39440402/bf77844e-c69a-4e1f-a1f0-58222b979685)


## Como rodar

Na raiz, execute:
`docker compose up --build -d`

Para buildar e subir os 4 containers no modo detached


Em seguida, acompanhe os logs do simulador:
`docker logs -f hbm-simulator`

No Postman, inicie uma request gRPC para ` localhost:50051` importando o arquivo proto em `/hbm_simulator/proto/hbm_simulator.proto `

### Métodos

**StartNormalMeasurement**: Dá início a uma geração de dados dentro do padrão

**StartIrregularMeasurement**: Gera dados normais e de forma aleatória, gera dados fora do normal

**StopMeasurement**: Para todas as medições

**ListAllIrregularities**: Retorna ao simulador todas as irregularidades detectadas, com timestamp de início e fim

**ListAllMeasuresFromTheLast30Days**: Retorna ao simulador todas as medidas dos últimos 30 dias

O analisador segue a seguinte regra:

|      #Leitura       |   Irregularidade   | Um alerta foi enviado  | Leituras desde a última irregularidade |                                      |
| :-----------------: | :----------------: | :--------------------: | :------------------------------------: | :----------------------------------: |
|          1          |         0          |         false          |                   0                    |                                      |
|         20          |         1          |         false          |                   0                    |                                      |
|         26          |         2          |         false          |                   6                    |                                      |
|         27          |         3          |         false          |                   0                    |                                      |
|         30          |         4          |         false          |                   3                    |                                      |
| <strong>60</strong> | <strong>5</strong> | <strong>false</strong> |           <strong>0</strong>           |      <strong>ENVIA BIP</strong>      |
|          1          |         0          |          true          |                   0                    |                                      |
|         20          |         1          |          true          |                   0                    |                                      |
|         26          |         2          |          true          |                   6                    |                                      |
|         27          |         3          |          true          |                   0                    |                                      |
|         30          |         4          |          true          |                   3                    |                                      |
| <strong>60</strong> | <strong>5</strong> | <strong>true</strong>  |           <strong>0</strong>           |    <strong>NÃO ENVIA BIP</strong>    |
|          1          |         0          |          true          |                   0                    |                                      |
|         20          |         1          |          true          |                   0                    |                                      |
|         26          |         2          |          true          |                   6                    |                                      |
|         27          |         3          |          true          |                   0                    |                                      |
|         30          |         4          |          true          |                   3                    |                                      |
|         60          |         4          |          true          |                   30                   |                                      |
| <strong>90</strong> | <strong>4</strong> | <strong>true</strong>  |          <strong>60</strong>           |   <strong>ENVIA BIPBIPBIP</strong>   |
|          1          |         0          |         false          |                   0                    |                                      |
|         20          |         1          |         false          |                   0                    |                                      |
|         26          |         2          |         false          |                   6                    |                                      |
|         27          |         3          |         false          |                   0                    |                                      |
|         30          |         4          |         false          |                   3                    |                                      |
|         60          |         4          |         false          |                   30                   |                                      |
| <strong>90</strong> | <strong>4</strong> | <strong>false</strong> |          <strong>60</strong>           | <strong>NÃO ENVIA BIPBIPBIP</strong> |

## Tests
Entre individualmente nas pastas `hbm_analyzer` ou `hbm_simulator` e rode `npm tests`
