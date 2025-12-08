### Sub-módulo 1: Ordenação Elementar

#### 1.1 Bubble Sort

[cite\_start]Baseado no Slide 6 do Cap05 [cite: 847-853].

```plaintext
BubbleSort(v, n) {
    // i controla o número de passadas
    for (i = 1; i < n; i++) {
        // j percorre o vetor comparando adjacentes
        // A cada iteração i, o maior elemento 'flutua' para a posição n-i+1
        for (j = 1; j <= n - i; j++) {
            if (v[j] > v[j + 1]) {
                // Troca
                x = v[j];
                v[j] = v[j + 1];
                v[j + 1] = x;
            }
        }
    }
}
```

#### 1.2 Selection Sort

[cite\_start]Baseado no Slide 9 do Cap05 [cite: 864-876].

```plaintext
SelectionSort(v, n) {
    // Seleciona o menor elemento e coloca na posição i
    for (i = 1; i < n; i++) {
        min = i;
        
        // Busca o índice do menor valor no restante do vetor
        for (j = i + 1; j <= n; j++) {
            if (v[j] < v[min]) {
                min = j;
            }
        }
        
        // Troca o menor encontrado com a posição i atual
        x = v[min];
        v[min] = v[i];
        v[i] = x;
    }
}
```

#### 1.3 Insertion Sort

[cite\_start]Baseado no Slide 16 do Cap05 [cite: 1020-1027].

```plaintext
InsertionSort(v, n) {
    // Começa do segundo elemento (índice 2)
    for (i = 2; i <= n; i++) {
        x = v[i]; // Elemento a ser inserido (pivô da inserção)
        
        // Desloca elementos maiores que x para a direita
        // j varre de i para trás até encontrar a posição correta
        for (j = i; j > 1 && x < v[j - 1]; j--) {
            v[j] = v[j - 1];
        }
        
        // Insere x na posição correta encontrada
        v[j] = x;
    }
}
```

-----

### Sub-módulo 2: Estruturas de Heap

#### 2.1 Algoritmo Sift (Peneira)

Função auxiliar fundamental para reorganizar o heap "para baixo". [cite\_start]Baseado no Slide 6 do Cap06 [cite: 70-94].

```plaintext
Sift(i, n) {
    esq = 2 * i;      // Filho esquerdo
    dir = 2 * i + 1;  // Filho direito
    maior = i;

    // Verifica se filho esquerdo existe e é maior que a raiz
    if (esq <= n && v[esq] > v[i]) {
        maior = esq;
    }

    // Verifica se filho direito existe e é maior que o 'maior' atual
    if (dir <= n && v[dir] > v[maior]) {
        maior = dir;
    }

    // Se o maior não for a raiz, troca e continua descendo (recursão)
    if (maior != i) {
        aux = v[i];
        v[i] = v[maior];
        v[maior] = aux;
        Sift(maior, n);
    }
}
```

#### 2.2 Build Heap

Transforma um vetor em um heap. [cite\_start]Baseado no Slide 7 do Cap06 [cite: 101-105].

```plaintext
Build(v, n) {
    // Aplica Sift das folhas para a raiz (metade do vetor até o início)
    for (i = floor(n / 2); i > 0; i--) {
        Sift(i, n);
    }
}
```

#### 2.3 Heap Sort

Algoritmo principal. [cite\_start]Baseado no Slide 20 do Cap06 [cite: 288-295].

```plaintext
HeapSort(v, n) {
    Build(v, n); // Primeiro transforma o vetor em heap
    
    // Troca a raiz (max) com o último, reduz o tamanho e reorganiza
    for (i = n; i > 1; i--) {
        // Troca raiz (v[1]) com a última posição corrente (v[i])
        aux = v[i];
        v[i] = v[1];
        v[1] = aux;
        
        // Reorganiza o heap para o tamanho i-1
        Sift(1, i - 1);
    }
}
```

-----

### Sub-módulo 3: Divisão e Conquista

#### 3.1 Merge Sort (Recursivo)

[cite\_start]Baseado no Slide 25 do Cap05 [cite: 1107-1128].

```plaintext
MergeSort(i, f) {
    if (i < f) {
        m = floor((i + f) / 2);
        MergeSort(i, m);      // Ordena metade esquerda
        MergeSort(m + 1, f);  // Ordena metade direita
        Merge(i, m, f);       // Intercala as metades
    }
}

Merge(i, m, f) {
    i1 = i;
    i2 = i;
    i3 = m + 1;
    
    // Intercalação usando vetor auxiliar 'aux'
    while (i2 <= m && i3 <= f) {
        if (v[i2] < v[i3]) {
            aux[i1++] = v[i2++];
        } else {
            aux[i1++] = v[i3++];
        }
    }
    
    // Copia o restante da primeira metade (se houver)
    while (i2 <= m) {
        aux[i1++] = v[i2++];
    }
    
    // Copia o restante da segunda metade (se houver)
    while (i3 <= f) {
        aux[i1++] = v[i3++];
    }
    
    // Copia do auxiliar de volta para o vetor original v
    for (j = i; j <= f; j++) {
        v[j] = aux[j];
    }
}
```

#### 3.2 Quick Sort

[cite\_start]Baseado nos Slides 22 (Lógica Básica) e 25 (Particionamento) do Cap06 [cite: 317-325, 346-358].

```plaintext
QuickSort(min, max) {
    if (min < max) {
        p = Partition(min, max); // Encontra o pivô
        QuickSort(min, p - 1);   // Ordena subvetor esquerdo
        QuickSort(p + 1, max);   // Ordena subvetor direito
    }
}

Partition(left, right) {
    pivot = v[left]; // Pivô é o primeiro elemento
    l = left + 1;
    r = right;
    
    while (true) {
        // Avança l enquanto menor que pivô
        while (l < right && v[l] < pivot) {
            l++;
        }
        // Recua r enquanto maior ou igual ao pivô
        while (r > left && v[r] >= pivot) {
            r--;
        }
        
        if (l >= r) break;
        
        // Troca v[l] e v[r]
        aux = v[l];
        v[l] = v[r];
        v[r] = aux;
    }
    
    // Coloca o pivô na posição correta (troca v[left] com v[r])
    v[left] = v[r];
    v[r] = pivot;
    
    return r; // Retorna a posição final do pivô
}
```

-----

### Sub-módulo 4: Ordenação por Distribuição

#### 4.1 Radix Sort

[cite\_start]Baseado no Slide 34 do Cap05 [cite: 1280-1290].

```plaintext
RadixSort(v, n, d) {
    // d iterações (número de dígitos)
    // factor começa em 1 e multiplica pela base a cada passo
    factor = 1;
    
    for (i = 0; i < d; i++) {
        // Fase de Distribuição: coloca nos baldes (queues)
        for (j = 1; j <= n; j++) {
            digit = (v[j] / factor) % base;
            q[digit].enqueue(v[j]);
        }
        
        // Fase de Coleta: retira dos baldes e devolve ao vetor
        k = 1;
        for (j = 0; j < base; j++) {
            while (!q[j].isEmpty()) {
                v[k++] = q[j].dequeue();
            }
        }
        
        factor = factor * base;
    }
}
```

-----

### Sub-módulo 5: Redes de Ordenação

#### 5.1 Bitonic Sort

[cite\_start]O material apresenta a lógica baseada em redes de comparação e recursão estrutural, sem um bloco de código único explícito, mas define a estrutura recursiva [cite: 715-718] [cite\_start]e a lógica do "Meio-Limpador" e "Intercalador" [cite: 638-641]. Abaixo está a representação algorítmica da estrutura de rede descrita nos slides 46 e 49.

```plaintext
// Função comparadora básica (Slide 36)
CompareAndSwap(v, i, j, direcao) {
    if (direcao == CRESCENTE && v[i] > v[j]) swap(v[i], v[j]);
    if (direcao == DECRESCENTE && v[i] < v[j]) swap(v[i], v[j]);
}

// Intercalador Bitônico (Baseado na recursão do Slide 46)
BitonicMerge(v, low, count, direcao) {
    if (count > 1) {
        k = count / 2;
        // Passo do Meio-Limpador (Slide 41/508)
        for (i = low; i < low + k; i++) {
            CompareAndSwap(v, i, i + k, direcao);
        }
        // Recursão nos sub-vetores
        BitonicMerge(v, low, k, direcao);
        BitonicMerge(v, low + k, k, direcao);
    }
}

// Ordenador Bitônico Principal (Baseado no Slide 49)
BitonicSort(v, low, count, direcao) {
    if (count > 1) {
        k = count / 2;
        
        // Ordena metade inferior em ordem CRESCENTE (ou direcao oposta)
        BitonicSort(v, low, k, !direcao); 
        
        // Ordena metade superior em ordem DECRESCENTE (ou mesma direcao)
        // Nota: A formação da sequência bitônica exige direções opostas
        BitonicSort(v, low + k, k, direcao);
        
        // Intercala o resultado
        BitonicMerge(v, low, count, direcao);
    }
}
```