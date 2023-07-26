import {HandPalm, Play} from 'phosphor-react'
import {FormProvider, useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {createContext, useState} from 'react'
import z from 'zod'


import {  
  HomeContainer, 
  StartCountdownButton, 
  StopCountdownButton, 
} from './styles'

import { Countdown } from './components/CountDown'
import {NewCycleForm} from './components/NewCycleForm'


// interface NewCycleFormData {
//   task: string
//   minutesAmount: number
// }



interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

interface CyclesContextType {
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  amountSecondsPassed: number;
  markCurrentCycleAsFinished: () => void;
  setSecondsPassed: (seconds: number) => void;
}

const newCycleFormValidateSchema = z.object({
  task: z.string().min(1, 'Informe a tarefa'),
  minutesAmount: 
  z.number()
  .min(1,'O tempo precisa ser no minimo 1 minuto')
  .max(60, 'O tempo precisa ser no máximo 60 minutos')

})

type NewCycleFormData = z.infer<typeof newCycleFormValidateSchema>

export const CyclesContext = createContext({} as CyclesContextType)

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)
  

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidateSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    }
   })

   const {register, handleSubmit, watch, reset} = newCycleForm

   const activeCycle = cycles.find((cycle) => cycle.id == activeCycleId)

   function setSecondsPassed(seconds: number) {
      setAmountSecondsPassed(seconds)
   }
  function markCurrentCycleAsFinished(){
    setCycles((state) =>
            state.map((cycle) => {
              if(cycle.id == activeCycleId){
                return {...cycle, interruptedDate: new Date()}
              }else {
                return cycle
              }
            }),
          )
  }

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

    setCycles((state) =>
      state.map((cycle) => {
        if(cycle.id == activeCycleId){
          return {...cycle, interruptedDate: new Date()}
        }else {
          return cycle
        }
      }),
    )

    setActiveCycleId(null)
   }


   const isSubmitDisabled = watch('task')

    return (
      <HomeContainer>
        <form onSubmit={handleSubmit(handleCreateNewCycle)} action=''>
          <CyclesContext.Provider 
            value={{
              activeCycle, 
              activeCycleId, 
              markCurrentCycleAsFinished, 
              amountSecondsPassed,
              setSecondsPassed
            }}
          >
            
            <FormProvider {...newCycleForm}>
              <NewCycleForm/>
            </FormProvider>
      
            <Countdown />
          </CyclesContext.Provider>
          

            {activeCycle ? (
              <StopCountdownButton onClick={handleInterruptCycle} type="button">
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
  