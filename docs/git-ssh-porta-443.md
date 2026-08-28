# Git + SSH pelo GitHub na porta 443

## Problema

Ao tentar `git clone` de `git@github.com:devtiagoabreu/isb.git`, a autenticação SSH
falhava com:

```text
git@github.com's password:
Permission denied, please try again.
git@github.com: Permission denied (publickey,password).
```

Mesmo com a chave SSH pública corretamente cadastrada na conta GitHub
(`Settings > SSH and GPG keys`) e carregada no OpenSSH Agent, o servidor
rejeitava a autenticação.

## Diagnóstico

Investigação realizada:

1. **Chave local existe** — `~/.ssh/id_ed25519` e `~/.ssh/id_ed25519.pub`.
2. **SSH Agent parado** — serviço `ssh-agent` estava `Disabled`. Habilitado e iniciado:
   ```powershell
   Set-Service ssh-agent -StartupType Automatic
   Start-Service ssh-agent
   ssh-add ~\.ssh\id_ed25519
   ```
3. **Host key ausente** — `Host key verification failed`. Adicionada com:
   ```powershell
   ssh-keyscan github.com >> ~\.ssh\known_hosts
   ```
4. **Chave idêntica à registrada** — confirmado pela API:
   `https://api.github.com/users/devtiagoabreu/keys` (o fingerprint local
   `SHA256:LMID7E/...` batia com o item `161589506` da conta).
5. **Fingerprint consistente** — `ssh-keygen -lf` da chave privada derivava a
   mesma pública registrada.

Mesmo com tudo correto, a porta **22** continuava rejeitando.

### Causa raiz

**Regra de NAT no roteador MikroTik.** Foi criada uma regra `dstnat` para
fazer port-forward da porta **22** para um Orange Pi da rede local. Como a
regra captura **todo** o tráfego com destino à porta 22 — sem filtrar a
interface de origem nem o IP de destino —, ela também interceptava as conexões
**de saída** para `github.com:22` e as redirecionava para o Orange Pi. Por isso
o SSH na porta 22 falhava (autenticação rejeitada), mas a porta **443**
funcionava (sem regra de NAT).

Prova: conectando pela alternativa **443**, a autenticação funcionou:

```text
Hi devtiagoabreu! You've successfully authenticated,
but GitHub does not provide shell access.
```

### Correção no MikroTik

Restringir a regra para valer apenas para conexões **externas** que chegam no
IP público (trocar `ether1-wan` pela interface WAN real e `SEU_IP_PUBLICO`
pelo IP externo):

```text
/ip firewall nat set [find where dst-port=22] in-interface=ether1-wan dst-address=SEU_IP_PUBLICO
```

Com isso o port-forward só se aplica a quem vem de fora; conexões internas
para o GitHub seguem pela rota normal.

## Solução

Configurar o SSH para conversar com o GitHub **exclusivamente pela porta 443**
através do host alternativo `ssh.github.com`.

Arquivo `~/.ssh/config`:

```text
Host github.com
    HostName ssh.github.com
    Port 443
    User git

Host ssh.github.com
    Port 443
    User git
```

Depois disso, `git clone git@github.com:devtiagoabreu/isb.git` (e qualquer
push/pull) funciona sem erro.

## Verificação

```powershell
ssh -p 443 -T git@ssh.github.com
# Hi devtiagoabreu! You've successfully authenticated, ...
```

## Observações

- O SSH funciona via porta 443 da mesma forma (HTTPS/SSH sobre o mesmo
  endpoint `ssh.github.com`).
- Essa configuração é **por máquina** (`~/.ssh/config`) e não precisa ser
  commitada no repositório.
- **Prefira corrigir o NAT do MikroTik** (ver "Correção no MikroTik" acima).
  A regra atual redireciona todo o tráfego de porta 22 para o Orange Pi, o que
  além de quebrar o Git pode gerar problemas de segurança e de outras
  ferramentas SSH.
- Se um dia a porta 22 voltar a funcionar, basta remover o bloco `Host github.com`
  do `~/.ssh/config` para voltar ao comportamento padrão.