import React from "react";

type Props = { steps: string[]; onDone: () => void };
type State = { step: number; visited: number[] };

export class CheckoutWizard extends React.Component<Props, State> {
  state: State = { step: 0, visited: [0] };

  next = () => {
    const last = this.props.steps.length - 1;
    if (this.state.step === last) {
      this.props.onDone();
      return;
    }
    const step = this.state.step + 1;
    this.setState({ step, visited: [...this.state.visited, step] });
  };

  render() {
    return (
      <section>
        <h2>{this.props.steps[this.state.step]}</h2>
        <button onClick={this.next}>
          {this.state.step === this.props.steps.length - 1 ? "Place order" : "Continue"}
        </button>
      </section>
    );
  }
}
