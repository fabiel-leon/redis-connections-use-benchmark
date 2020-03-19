# Connections: `"Open and close"` vs `"Reuse"` vs `"Pool"`

## Why

This project is done in order to obtain the best method to use connections

## Use

You need to have a `redis-server` running locally
if you dont have it install it with the next command in linux or WLS (Windows Linux Subsystem)

```bash
$ sudo apt-get install redis-server -y
```

Test redis connection with the next command `redis-cli` and write `ECHO TEST`

```bash
$ redis-cli
127.0.0.1:6379> ECHO TEST
"TEST"
```

Start the benchmarks

```bash
$ git clone https://github.com/fabiel-leon/redis-connections-use-benchmark.git
$ npm i
$ node main.js
```

## Used Terms

- **Open and Close Connection**: this terms is used for the connections that are used and closed every time you make a request.
- **Reuse connection**: this term is used for connections that are opened and reused until the program finish.
- **Connection Pool**: this is when you make several connections and choose one that is not being used at that time.

## Used hardware

Commands used to get hardware information are: lscpu and cat /proc/meminfo

```bash
$ lscpu
Arquitectura:                        x86_64
modo(s) de operación de las CPUs:    32-bit, 64-bit
Orden de los bytes:                  Little Endian
CPU(s):                              8
Lista de la(s) CPU(s) en línea:      0-7
Hilo(s) de procesamiento por núcleo: 2
Núcleo(s) por «socket»:              4
«Socket(s)»                          1
Modo(s) NUMA:                        1
ID de fabricante:                    GenuineIntel
Familia de CPU:                      6
Modelo:                              142
Nombre del modelo:                   Intel(R) Core(TM) i5-8265U CPU @ 1.60GHz
Revisión:                            11
CPU MHz:                             515.323
CPU MHz máx.:                        3900,0000
CPU MHz mín.:                        400,0000
BogoMIPS:                            3600.00
Virtualización:                      VT-x
Caché L1d:                           32K
Caché L1i:                           32K
Caché L2:                            256K
Caché L3:                            6144K
CPU(s) del nodo NUMA 0:              0-7
Indicadores:                         fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm constant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb invpcid_single ssbd ibrs ibpb stibp tpr_shadow vnmi flexpriority ept vpid fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid mpx rdseed adx smap clflushopt intel_pt xsaveopt xsavec xgetbv1 xsaves dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp md_clear flush_l1d arch_capabilities


$ cat /proc/meminfo
MemTotal:        8037676 kB
MemFree:          143556 kB
MemAvailable:     938440 kB
Buffers:           84108 kB
Cached:          1673080 kB
SwapCached:            0 kB
Active:          6233112 kB
Inactive:        1195344 kB
Active(anon):    5643972 kB
Inactive(anon):   811260 kB
Active(file):     589140 kB
Inactive(file):   384084 kB
Unevictable:        1508 kB
Mlocked:            1508 kB
SwapTotal:             0 kB
SwapFree:              0 kB
Dirty:              2472 kB
Writeback:             0 kB
AnonPages:       5672904 kB
Mapped:           504204 kB
Shmem:            817720 kB
Slab:             172852 kB
SReclaimable:      82700 kB
SUnreclaim:        90152 kB
KernelStack:       20288 kB
PageTables:       124384 kB
NFS_Unstable:          0 kB
Bounce:                0 kB
WritebackTmp:          0 kB
CommitLimit:     4018836 kB
Committed_AS:   17783856 kB
VmallocTotal:   34359738367 kB
VmallocUsed:           0 kB
VmallocChunk:          0 kB
HardwareCorrupted:     0 kB
AnonHugePages:      2048 kB
ShmemHugePages:        0 kB
ShmemPmdMapped:        0 kB
CmaTotal:              0 kB
CmaFree:               0 kB
HugePages_Total:       0
HugePages_Free:        0
HugePages_Rsvd:        0
HugePages_Surp:        0
Hugepagesize:       2048 kB
DirectMap4k:      636184 kB
DirectMap2M:     7622656 kB
DirectMap1G:           0 kB


```

### Hardware resume

Intel(R) Core(TM) i5-8265U CPU @ 1.60GHz, 4 Cores, 8 CPU(s), Virtualización: VT-x, 8 Gb RAM

## Benchmark Results

In case of concurrent work were used a value of 3 task in parallel.

### Final Results

```node
$ node
Start Opening and Closing connections
Opening and Closing connections 14842 realtime: 5000
Start Connection pool
Connection pool 60609 realtime: 5000
Start Reusing connections
Reusing connections 80327 realtime: 5000
Start Concurrent Opening and Closing connections
Concurrent Opening and Closing connections 19198 realtime: 5631
Start Concurrent Pool connection
Concurrent Pool connection 68104 realtime: 5273
Start Concurrent Reusing connections
Concurrent Reusing connections 139780 realtime: 5743
```

![Connections Benchmark graphs ](/connection-benchmark-graphs.png)

## Conclusions

The best performance is given by reusing the connection, even better than using a connection pool. But that's strange it should be backwards. What do you think is wrong here?
Those who use the connection pool have 3 connections the other methods only use 1 and reusing the connection have better performance.
Using the pool has 4X times more performance than opening and closing connections, but reusing the connection has 1.3 times better performance than using the pool.

In concurrent mode closing and opening the connections does not make much difference and using the connection pool does not improve much either, but reusing the connection doubles the performance of using the pool and is 7X times better than opening and closing the connections.
