// src/execution/Orchestrator.ts

import { TaskExecutor, TaskConfig, TaskResult } from "./TaskExecutor"
import { AuthSigner } from "./AuthSigner"

export async function orchestrate() {
  const executor = new TaskExecutor()

  // register your tasks
  executor.register({ id: "pulse1", type: "backPulse", params: { events: [] } })
  executor.register({
    id: "scan1",
    type: "riskScan",
    params: { contractAddress: "", windowMinutes: 60, context: {} },
  })

  // execute
  const results: TaskResult[] = await executor.runAll()
  console.log("Results:", results)

  // sign the results
  const signer = new AuthSigner()
  const payload = JSON.stringify(results)
  const signature = await signer.sign(payload)
  console.log("Signature:", signature)

  const ok = await signer.verify(payload, signature)
  console.log("Verified:", ok)
}

if (require.main === module) {
  orchestrate().catch(err => {
    console.error("Orchestration error:", err)
    process.exit(1)
  })
}
