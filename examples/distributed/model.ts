import * as sm from '@shumai/shumai'

const model_a = sm.io.remote_model('localhost:3001')
const model_b = sm.io.remote_model('localhost:3002')

const model = async (t: sm.Tensor) => {
  t = await model_a(t)
  t = await model_b(t)
  return t
}

sm.io.serve_model(
  model,
  sm.optim.sgd,
  { port: 3000 },
  {
    statistics: async () => {
      const m_stat = await (await fetch('localhost:3001/statistics')).json()
      const b_stat = await (await fetch('localhost:3002/statistics')).json()
      return { m: m_stat, b: b_stat }
    }
  }
)
