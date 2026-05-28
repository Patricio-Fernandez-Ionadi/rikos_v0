import { useContext } from 'react'
import { SupportContext } from './support-context.jsx'

export { SupportProvider } from './support-context.jsx'

export function useSupport() {
	const ctx = useContext(SupportContext)
	if (!ctx) throw new Error('useSupport must be used within <SupportProvider>')
	return ctx
}
