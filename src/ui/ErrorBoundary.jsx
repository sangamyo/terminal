import { Component } from 'react'

/** Falls back gracefully (e.g. WebGL context failure) instead of blanking the page. */
export default class ErrorBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error) {
    console.warn('[3D disabled]', error)
    this.props.onError?.(error)
  }
  render() {
    return this.state.failed ? (this.props.fallback ?? null) : this.props.children
  }
}
