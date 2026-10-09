# Exemplo de calibração — revisão completa

Revisão de referência, usada para calibrar o tom, a profundidade e a granularidade. O conteúdo é específico deste paper (boids, UE5, fast mode, estações). Não o copies para revisões de outros documentos. Usa-o para ver *como* cada lente se aplica.

---

# REVISÃO — "A Rule Authoring Framework for Pedestrian Activity Simulation with Hybrid Boids and Shared Resources"

**Autores:** Armada, Ramires Fernandes — formato IEEE de conferência, 8 páginas
**Data da revisão:** 2026-10-08

> **Nota de enquadramento:** esta revisão é uma simulação construída a partir do perfil público e de exemplos de feedback do Prof. Ramires Fernandes. Não é a opinião dele e não prevê a avaliação.

---

## 1. Avaliação geral

O texto é honesto e bem escrito. O âmbito fica delimitado na introdução ("no claims about behavioural realism"), as comparações entre Mall A e Mall B são apresentadas como não atribuíveis a um só fator, os defeitos são reportados em vez de escondidos, e todas as tabelas e figuras saem de um único script sobre os logs. Isto é raro e é bom. A ideia central, tratar o tempo autorado como um pedido, está clara e o diagrama da Fig. 1 explica-a bem.

O problema principal é estrutural: a secção VIII (Conclusion) está vazia. O título da secção aparece e logo a seguir vêm as referências. O segundo problema é metodológico: a principal conclusão do abstract ("most of the gap... comes from walking... rather than from queueing") é em grande parte um artefacto de duas escolhas de implementação. A primeira é a escala do relógio, a segunda é a forma de medir o atraso. Ambas são explicadas abaixo.

## 2. Comentários gerais mais relevantes

1. **Escala temporal incoerente.** O relógio avança 1 minuto simulado por segundo real, mas os agentes andam em tempo real. O próprio texto o diz em VII-C: "every metre costs about half a simulated minute", e uma deslocação de cerca de 100 m dura 51 minutos simulados. Em tempo simulado, os agentes andam cerca de 60x mais devagar do que um peão real. Por isso, "walking accounted for 94 to 95%" é uma consequência da compressão do tempo, não do cenário. Isto tem de ser dito explicitamente no abstract e na secção VII-C. Uma alternativa é tornar o relógio e a locomoção coerentes e repetir as corridas.
2. **A métrica de atraso mede o dispatch, não o início da atividade.** Uma regra "is used up when its action is dispatched" (IV-A), e o "started late" é medido no momento do dispatch. A espera numa fila depois do dispatch não conta como atraso dessa regra. Assim, "queueing accounted for under 1%" é em parte estrutural. A frase "Our central idea... when it actually starts depends on... whether the resource is free" pede o início real do serviço como medida. É preciso definir a métrica com precisão e, idealmente, reportar também o atraso no início do serviço (o recorder já regista os eventos das estações).
3. **"Hybrid boids" está no título mas não é avaliado.** O fast mode desliga o blend, e a maioria dos resultados (shopping centre e daily life) vem do fast mode. A família "Directed flows" está na Tabela I com "measurement only", mas não há nenhuma medição dela no paper. Há duas saídas: retirar "Hybrid Boids" do título, ou acrescentar uma tabela pequena com o blend ligado e desligado nos mapas de directed flow (tempo de percurso, dispersão lateral, sobreposições).
4. **"Rule Authoring" está no título, mas o paper não mostra uma única regra autorada.** Não há um listing nem um exemplo de ficheiro de schedule, nem nenhuma medida de esforço de autoria ("We have not yet measured authoring effort"). A correção mais barata é um listing de 10 a 15 linhas com o almoço em duas fases da food court, mais duas colunas na Tabela I: número de regras e número de linhas de código específicas do cenário.
5. **A experiência de capacidade não exercita a contenção.** Dez agentes, quatro balcões e quatro mesas: queueing <1%, e "no desk ever formed a queue". A pergunta motivadora ("enough tables at lunchtime?") nunca é posta à prova. Em fast mode, repetir a Tabela II com 50 e 100 agentes é barato. O mecanismo de cópia de agentes já existe (VII-G).

Se não atacares estas questões, na oral o arguente poderá criticar a tua estratégia.

## 3. Pontos metodológicos

- **Determinismo.** "two runs with the same seed can therefore differ". Isto contradiz o objetivo da secção III ("any difference... apart from random variation, comes from the environment"). A causa é o passo variável. A correção é um passo de simulação fixo, desacoplado do frame rate. Se não for possível, é preciso reportar o FPS durante as corridas comportamentais e assumir isto como limitação já na secção III.
- **Estatística.** Cinco corridas e só médias. A legenda da Fig. 3 diz "Table II gives all settings and ranges", mas a Tabela II não tem intervalos. É preciso acrescentar média ± desvio padrão ou min–max. O texto diz que as diferenças "are of the same order as the variation between runs", mas o abstract afirma "extra places at a food court reduce waiting" sem reservas. Em fast mode com 10 agentes, fazer 30 corridas por configuração é barato. Isso permitiria apresentar intervalos de confiança.
- **"In every one of the five seeds" (VII-B).** Se a seed não fixa o resultado, comparar por seed não é uma comparação emparelhada. Basta escrever "in all five runs".
- **Definição de "wait per station visit".** Na Tabela II, "Shop desks, 1 place" = 3.4 min, mas "no desk ever formed a queue". Então a métrica é a espera média em todas as estações, não nas secretárias. A Fig. 3(a), "Waiting at a station" com o tipo de estação no eixo, lê-se ao contrário. Também falta dizer se a espera inclui a caminhada até um lugar já reservado.
- **Coluna "1 place" na Tabela II.** Se o Mall A base tem um lugar por estação, como sugere a nota da Tabela III, as três células da coluna 1 são a mesma configuração (3.4 / 3.2 / 3.3). Pode-se dizer isso, usando a diferença como estimativa do ruído, ou juntá-las numa linha baseline.
- **A política das estações é o defeito, não um resultado.** Duas regras explicam a maior parte das filas restantes: o agente entra na fila "of the first one and stays in it", e a reserva fica retida durante a caminhada (28 minutos). A secção IV-C diz "one station in the area", e é preciso dizer que é a primeira da lista. Também falta clarificar se uma super station partilha uma única fila. As correções são baratas: uma fila partilhada por área e um timeout de reserva. Este timeout resolve também o defeito "reservations that are never released". Depois disso, repetir as Tabelas II e III.
- **Reprodutibilidade, o que falta:**
  - CPU. O gargalo é o game thread e o setup só indica a GPU e a RAM. Esta é a omissão mais grave da secção VII-A.
  - Build configuration (Development ou Shipping).
  - Velocidade de marcha dos agentes. Meio minuto por metro corresponde a cerca de 2 m/s, acima dos 1.2–1.4 m/s típicos.
  - Parâmetros dos boids: raios, pesos, fator de redução, estrutura espacial da pesquisa de vizinhos (o expoente de 1.25 sugere força bruta?).
  - Valor do "very high cost" do navmesh.
  - Tamanho do "small random delay".
  - Valor do time limit de desistência, e se está em segundos reais ou simulados.
  - Hora do dia em que começam os 120 s de medição de performance.
- **Unidades de tempo misturadas.** O timer de evacuação de 120 s está em segundos reais? No visual mode isso equivaleria a 2 horas simuladas. A secção VII-H diz "Several timeouts... count real seconds", mas falta dizer quais.
- **Custo do framework vs. custo das personagens.** O custo fixo de 0.2 ms por agente e o crash nos hair strands indicam custo de assets, não do framework. Um perfil com Unreal Insights que separe scheduler, estações, boids e animação/rendering, ou uma corrida com uma malha simples, mostraria o custo real do framework.
- **Modelo formal.** Falta uma máquina de estados do agente (idle / walking / reserved / queued / served / emergency) com as prioridades. "Higher-priority states" não estão ordenados nem aparecem na Fig. 1. Um diagrama pequeno ou um pseudocódigo do tick do scheduler resolve.

## 4. Estado da arte

- O estado da arte conduz ao trabalho (a divisão action selection / steering de Reynolds [2] encaixa bem). Faltam, no entanto, as alternativas mais próximas, e um arguente de CG vai notar:
  - Unreal Mass AI / MassEntity, ZoneGraph e State Tree. É o framework de multidões do próprio UE5, que o paper usa na versão 5.4, e combina-se com Smart Objects [10].
  - Action selection em game AI: behaviour trees, utility AI.
  - Discrete-event simulation e ferramentas com serviços e filas (ex.: AnyLogic Pedestrian Library). "Stations, queue, service time" é vocabulário de DES.
  - Evitamento local do próprio motor (RVO, Detour Crowd no UE).
  - CAROSA (Allbeck), sobre autoria de NPCs com papéis e horários. Verificar a referência; é próximo de [6].
- **Justificação dos boids.** "simple to run inside the engine" é atacável, porque o UE já traz RVO e Detour Crowd. É mais honesto e mais robusto escrever algo como: "we started from boids because [project origin / familiarity], and the authoring layer does not depend on that choice". A segunda parte já está no texto.
- **Diferença em relação a [5], [6] e [10].** "Our focus is narrower" não chega. Uma frase explícita resolve: "unlike [10], our stations add capacity, a FCFS queue, timed service, staged activities and deferral semantics for timed rules".

## 5. Comentários por secção

**Abstract:** "keeps 30 frames per second with up to between 50 and 100 agents": a frase está confusa, e 100 agentes na evacuação dão 29.8. Proposta: "at least 30 fps with 50 agents in both scenarios, and close to 30 fps with 100 agents in the evacuation". Falta também "directed-flow" (hífen perdido na translineação).

**Secção I:** "interact only through targets, arrivals, and completions": "only" é desmentido pela secção V (ramos específicos de cenário no agente, funcionalidades decididas pelo nome do mapa). Trocar por "mainly", ou referir a exceção.

**Secção IV-A:** "A rule may also carry a simple condition... and a probability, although none of our current schedules uses either." Uma funcionalidade não usada não deve aparecer como parte do pipeline. Ou sai, ou passa a "supported but not exercised". "group leader" e, em VII-A, "police-and-robbers": nunca são apresentados. Ou uma frase a apresentá-los, ou cortar.

**Secção IV-C:** "Outside the shopping centre scenario, an agent... gives up": porque não no shopping? Qual é o limite?

**Secção IV-E:** O exemplo dos dois grupos que partilham secretárias é o caso motivador. Os logs mostram-no a acontecer no daily urban life? A Tabela IV não reporta filas nas secretárias.

**Secção VII-B:** A legenda da Fig. 3(b) diz "Mall A (50 runs)". De onde vêm as 50? (3x3x5 = 45, mais as 5 da Tabela III = 50?) É preciso dizer.

**Secção VII-C:** Fig. 3(b): 65 + 31 + <1 ≈ 96%, e 95 + <1 + <1 ≈ 96%. Qual é o resto? Falta uma categoria "other" (estados prioritários? breaks?). "started late" em relação ao tempo autorado ou ao tempo elegível com jitter? O recorder regista os dois, mas o texto não diz qual se usa.

**Secção VII-D:** Na Tabela III, "Average wait per visit" do Mall A é 4.8, mas a baseline da Tabela II dá 3.2–3.4 para o mesmo mapa, modo e número de corridas. Qual é a razão? "The last column counts...": é uma linha, não uma coluna. "Rules never carried out 0.8": é uma contagem por corrida e não uma percentagem. A unidade tem de estar na tabela.

**Secção VII-E:** "both queues": diz antes quantas saídas há. Os 5 ou 6 agentes "safe" por corrida tornam a Fig. 3(c) pouco interpretável. A métrica da figura é "passed an exit", e isso deve ficar claro na legenda.

**Secção VII-F:** "Walks that reached their target 70": 30% das caminhadas falham. Isto pesa mais do que o texto sugere. Trocar o alvo de ponto único por uma área ou um raio de chegada é uma correção barata.

**Secção VII-G:** "Ten fps... 150 in daily urban life": não foi medido com 150 agentes, é uma interpolação entre 17.4 e 7.2. Dizer isso, ou medir. "GPU needed at most 53 ms even with 1600 agents": só no daily routine, porque a evacuação crashou. A nota da Tabela V diz "one run at 800 and 1600", mas o texto diz "all three attempts".

**Secção VII-H:** "We will correct them before running the controlled studies": se forem corrigidos antes da submissão (timeout de reserva, fila partilhada, alvos por área), quase todas as tabelas melhoram de forma substancial.

**Secção VIII:** Está vazia. Deve fechar cada contribuição da introdução, uma a uma, e terminar com os resultados que realmente se viram e o trabalho futuro.

## 6. Pontos menores

- O título é longo e promete o que não avalia. Proposta "livre de críticas": "Authored Schedules over Capacity-Limited Stations for Boids-Based Pedestrian Activity Simulation: Design and Preliminary Measurements"
- Na secção III, "Why we built the framework" soa informal. "Design goals" é melhor.
- Fig. 3: o título "Preliminary behavioural results" contradiz "behavioural validation is outside scope". Proposta: "Preliminary simulation outputs".
- Nota da Tabela V e Fig. 4: "30 or more looks fluid" e "30: smooth" são subjetivos. Proposta: "30 fps, a common interactive threshold".
- [10] é documentação web. Para um produto é aceitável, mas convém acrescentar uma fonte primária para Mass/State Tree se forem citados.
- Verificar o DOI de [7].
- Verificar o limite de páginas e o template da venue. Há cerca de 0,75 de página livre na p. 8, que chega para a conclusão e para o listing.

## 7. Limitações a pôr explicitamente na secção VI

1. A compressão do relógio (60x) torna o tempo de marcha dominante. Os resultados sobre atrasos dependem desta escala.
2. O atraso é medido no dispatch da regra e não no início do serviço.
3. O blend dos hybrid boids está desligado no fast mode, onde corre a maioria das experiências, e não foi avaliado.
4. Os cenários são pequenos (10 agentes no shopping) e há pouca contenção.
5. As runs não são reprodutíveis com a mesma seed (passo variável).
6. A política das estações (fila na primeira estação, reserva sem timeout) gera esperas artificiais.
7. A performance mistura o custo do framework com o custo dos assets das personagens, numa só máquina.
8. A autoria não foi avaliada com utilizadores.

## 8. Perguntas prováveis na defesa

1. **O domínio da marcha não é um artefacto do relógio a 60x?**
   - Origem: VII-C, "half a simulated minute per metre"
   - Respondível: Parcialmente
   - Resposta sugerida: "Yes, under the default time scale walking is overrepresented. The finding is about schedules authored without this in mind. We [now report / will report] results with consistent scaling."
2. **Porque é que a fila tem <1% se há esperas de 33 min?**
   - Origem: Fig. 3(b) vs. VII-B
   - Respondível: Não, falta a métrica no início do serviço
   - Resposta sugerida: Explicar que a fila depois do dispatch não conta como atraso da regra, e mostrar a métrica alternativa.
3. **O que é que isto acrescenta a Unreal Smart Objects + Mass/State Tree?**
   - Origem: II-C
   - Respondível: Parcialmente
   - Resposta sugerida: Capacidade, fila FCFS, serviço temporizado, fases ordenadas e semântica de defer/drop. Os Smart Objects só reservam.
4. **Porque boids e não o RVO / Detour Crowd do UE?**
   - Origem: II-A
   - Respondível: Sim
   - Resposta sugerida: Explicar a origem do projeto, e que a camada de autoria é independente do modelo local.
5. **Onde está a avaliação dos hybrid boids?**
   - Origem: Título; fast mode
   - Respondível: Não
   - Resposta sugerida: Assumir que não há, ou mostrar a tabela on/off nos directed flows.
6. **Como sabem que um não-programador consegue autorar regras?**
   - Origem: III, objetivo 1
   - Respondível: Não
   - Resposta sugerida: "Not measured. Rule count vs. scenario code is our proxy; a user study is future work."
7. **Com 10 agentes, as conclusões sobre capacidade valem alguma coisa?**
   - Origem: VII-B
   - Respondível: Parcialmente
   - Resposta sugerida: "We read them as directions only." Melhor ainda, mostrar os resultados com 50 e 100 agentes.
8. **Porque é que a mesma seed dá resultados diferentes? Como comparam runs?**
   - Origem: VII-A
   - Respondível: Sim
   - Resposta sugerida: Passo variável. Tratam-se as runs como repetições independentes. Plano: passo fixo.
9. **Qual é o CPU, se é ele o gargalo?**
   - Origem: VII-A, VII-G
   - Respondível: Não está no texto
   - Resposta sugerida: Ter o modelo e o build configuration na ponta da língua, e acrescentá-los ao paper.
10. **Que parte do custo por agente é do framework e que parte é da personagem?**
    - Origem: 0.2 ms fixo; crash dos hair strands
    - Respondível: Não
    - Resposta sugerida: Mostrar um perfil com Unreal Insights, ou admitir a mistura.
11. **Porque não corrigiram os defeitos antes de submeter?**
    - Origem: VII-H
    - Respondível: Sim
    - Resposta sugerida: O contributo é o design. Os logs mostram que o mecanismo funciona e expõem os defeitos. Melhor: corrigi-los.
12. **Os pontos de chegada únicos e as reservas eternas não tornam a Tabela IV pouco informativa?**
    - Origem: VII-F
    - Respondível: Sim
    - Resposta sugerida: Admitir, e explicar a correção por raio de chegada e timeout.
13. **4.8 vs. 3.3 min de espera no Mall A: qual dos dois está certo?**
    - Origem: Tabelas II e III
    - Respondível: Ver nos logs
    - Resposta sugerida: Explicar a diferença de definição ou de runs.

## 9. Plano de ação

| Lacuna | Gravidade | Onde | Tipo | Esforço |
|---|---|---|---|---|
| Conclusão vazia | Crítica | VIII | Texto | 1 h |
| Escala do relógio vs. marcha, e conclusão do abstract | Crítica | Abstract, VII-C, VI | Texto (ou nova run com escala coerente) | 1 h / 1 dia |
| Métrica de atraso (dispatch vs. início do serviço) | Crítica | IV-A, VII-C | Texto + script sobre logs existentes | 0,5 dia |
| CPU e build config em falta | Crítica | VII-A, Fig. 4 | Texto | 10 min |
| Hybrid boids não avaliado | Importante | Título, VII | Nova experiência (directed flows on/off) ou mudar o título | 1 dia / 5 min |
| Nenhum exemplo de regra | Importante | IV-A | Listing + contagens na Tabela I | 2 h |
| Contenção fraca (10 agentes) | Importante | VII-B | Nova run em fast mode com 50/100 agentes | 0,5 dia |
| Médias sem dispersão, 5 runs | Importante | Tabelas II–IV | Script; mais runs em fast mode | 0,5 dia |
| Inconsistências 4.8 vs. 3.3, "column", 50 runs, resto da Fig. 3(b) | Importante | VII-B–D | Verificar logs + texto | 2 h |
| Política das estações / timeout de reserva / alvos por área | Importante | IV-C, VII | Código + repetir runs | 1–2 dias |
| Alternativas no estado da arte (Mass, State Tree, DES, RVO) | Importante | II | Texto + 3–4 refs | 2 h |
| Justificação honesta dos boids | Importante | II-A | Texto | 15 min |
| "only", condições e probabilidade não usadas, police/group-leader | Menor | I, IV-A, VII-A | Texto | 30 min |
| Máquina de estados do agente | Menor | IV | Figura pequena | 2 h |
| Título, legendas, unidades das tabelas, "150 interpolado" | Menor | Vários | Texto | 1 h |
| Limite de páginas / template | Menor | Global | Verificar | 10 min |

**Notas:**

- Não tive acesso a feedback anterior do orientador, por isso não verifiquei se já foi incorporado.
- Não tive acesso aos logs: as inconsistências de 4.8 vs. 3.3 e das 50 runs têm de ser confirmadas nos ficheiros do recorder.
