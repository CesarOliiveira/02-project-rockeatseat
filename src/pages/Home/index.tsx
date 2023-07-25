import {HandPalm, Play} from 'phosphor-react'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {useEffect, useState} from 'react'
import z from 'zod'
import {differenceInSeconds} from 'date-fns'

import { 
  CountdownContainer, 
  FormContainer, 
  HomeContainer, 
  MinuteAmountInput, 
  Separator, 
  StartCountdownButton, 
  StopCountdownButton, 
  TaskInput 
} from './styles'

const newCycleFormValidateSchema = z.object({
  task: z.string().min(1, 'Informe a tarefa'),
  minutesAmount: 
  z.number()
  .min(5,'O tempo precisa ser no minimo 5 minutos')
  .max(60, 'O tempo precisa ser no máximo 60 minutos')

})

// interface NewCycleFormData {
//   task: string
//   minutesAmount: number
// }

type NewCycleFormData = z.infer<typeof newCycleFormValidateSchema>

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate: Date;
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

   const {register, handleSubmit, watch, reset} = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidateSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    }
   })

   const activeCycle = cycles.find((cycle) => cycle.id == activeCycleId)

   useEffect(() => {
    let interval: number;
    if(activeCycle) {
      interval = setInterval(() => {
        setAmountSecondsPassed(
          differenceInSeconds(new Date(), activeCycle.startDate),
        )
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
   }, [activeCycle])

   function handleCreateNewCycle(data: NewCycleFormData) {
    const id = String(new Date().getTime())
    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date()
    }

    setCycles((state) => [...state, newCycle])
    setActiveCycleId(newCycle.id)
    setAmountSecondsPassed(0)


    reset()
   }

   function handleInterruptCycle(){
    setActiveCycleId(null)
   }

   const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
   const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

   const minutesAmount = Math.floor(currentSeconds / 60)
   const secondsAmount = currentSeconds % 60

   const minutes = String(minutesAmount).padStart(2, '0')
   const seconds = String(secondsAmount).padStart(2, '0')

   useEffect(() => {
      if (activeCycle){
        document.title = `${minutes}:${seconds}`
      }
   }, [minutes, seconds, activeCycle])

   const isSubmitDisabled = watch('task')
    return (
      <HomeContainer>
        <form onSubmit={handleSubmit(handleCreateNewCycle)} action=''>
          <FormContainer>
            <label htmlFor="task">Vou trabalhar em</label>
            <TaskInput 
              id="task"
              placeholder='Dê um nome para o seu projeto'
              list="task-suggestions"
              disabled={!!activeCycle}
              {...register('task')}
            />

            <datalist id='task-suggestions'>
              <option value="Projeto 1"></option>
              <option value="Projeto 2"></option>
              <option value="Projeto 3"></option>
              <option value="Trabalho"></option>
            </datalist>

            <label htmlFor="minutesAmount">durante</label>
            <MinuteAmountInput 
              type="number"
              id="minutesAmount" 
              placeholder='00'
              min={1}
              max={60}
              disabled={!!activeCycle}
              {...register('minutesAmount', {valueAsNumber: true})}
            />

            <span>minutos.</span>
          </FormContainer>
            <CountdownContainer>
              <span>{minutes[0]}</span>
              <span>{minutes[1]}</span>
              <Separator>:</Separator>
              <span>{seconds[0]}</span>
              <span>{seconds[1]}</span>
            </CountdownContainer>

            {activeCycle ? (
              <StopCountdownButton type="button">
              <HandPalm size={24}/>
              Interromper
            </StopCountdownButton>
            ) : (
              <StartCountdownButton disabled={!isSubmitDisabled} type="submit">
              <Play size={24}/>
              Começar
            </StartCountdownButton>
            )}
        </form>
      </HomeContainer>
    )
  }
  