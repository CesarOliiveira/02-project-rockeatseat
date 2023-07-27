import {HandPalm, Play} from 'phosphor-react'
import {FormProvider, useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {useContext} from 'react'
import z from 'zod'


import {  
  HomeContainer, 
  StartCountdownButton, 
  StopCountdownButton, 
} from './styles'

import { Countdown } from './components/CountDown'
import {NewCycleForm} from './components/NewCycleForm'
import { CyclesContext } from '../../contexts/CyclesContext'


// interface NewCycleFormData {
//   task: string
//   minutesAmount: number
// }



const newCycleFormValidateSchema = z.object({
  task: z.string().min(1, 'Informe a tarefa'),
  minutesAmount: 
  z.number()
  .min(1,'O tempo precisa ser no minimo 1 minuto')
  .max(60, 'O tempo precisa ser no máximo 60 minutos')

})

type NewCycleFormData = z.infer<typeof newCycleFormValidateSchema>



export function Home() {
  const {activeCycle, createNewCycle, interruptCurrentCycle} = useContext(CyclesContext)
  

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidateSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    }
   })

  const {handleSubmit, watch, reset} = newCycleForm


   function handleCreateNewCycle(data: NewCycleFormData){
      createNewCycle(data)
      reset()
   }

   const isSubmitDisabled = watch('task')

    return (
      <HomeContainer>
        <form onSubmit={handleSubmit(handleCreateNewCycle)} action=''>
        
            <FormProvider {...newCycleForm}>
              <NewCycleForm/>
            </FormProvider>

            <Countdown />
          
          

            {activeCycle ? (
              <StopCountdownButton onClick={interruptCurrentCycle} type="button">
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
  