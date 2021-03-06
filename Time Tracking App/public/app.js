class TimerDashboard extends React.Component {
    state = {
        timers: []
    }

    componentDidMount() {
        this.loadTimersFromServer();
        setInterval(this.loadTimersFromServer, 5000);
    }

    loadTimersFromServer = () => {
        client.getTimers((serverTimers) => {
            this.setState({ timers: serverTimers })
        });
    }

    updateTimer = (timerId, newTitle, newProject) => {
        this.setState(
            {
                timers: this.state.timers.map((timer) => {
                    if (timer.id === timerId) {
                        return Object.assign(
                            {},
                            timer,
                            { title: newTitle, project: newProject }
                        );
                    } else {
                        return timer;
                    }
                })
            }
        );

        client.updateTimer({ id: timerId, title: newTitle, project: newProject });
    }

    createTimer = (newTitle, newProject) => {
        const newTimer = helpers.newTimer({ title: newTitle, project: newProject });
        this.setState(
            Object.assign({ timers: this.state.timers.concat(newTimer) })
        );
        client.createTimer(newTimer);
    }

    deleteTimer = (timerId) => {
        this.setState(
            Object.assign(
                {
                    timers: this.state.timers.filter(timer => timer.id !== timerId)
                }
            )
        );

        client.deleteTimer({ id: timerId });
    }

    startTimer = (timerId) => {
        const now = Date.now();
        this.setState(
            {
                timers: this.state.timers.map((timer) => {
                    if (timer.id === timerId) {
                        return Object.assign(
                            {},
                            timer,
                            { runningSince: now }
                        );
                    } else {
                        return timer;
                    }
                })
            }
        );

        client.startTimer({id: timerId, start:now});
    }

    stopTimer = (timerId) => {
        const now = Date.now();
        this.setState(
            {
                timers: this.state.timers.map((timer) => {
                    if (timer.id === timerId) {
                        const lastElapsed = now - timer.runningSince;
                        return (
                            Object.assign(
                                {},
                                timer,
                                {
                                    elapsed: timer.elapsed + lastElapsed,
                                    runningSince: null
                                }
                            )
                        );
                    } else {
                        return timer;
                    }
                })
            }
        );

        client.stopTimer({id: timerId, stop:now});
    }

    render() {
        return (
            <div className='ui three column centered grid'>
                <div className='column'>
                    <EditableTimerList
                        timers={this.state.timers}
                        updateTimer={this.updateTimer}
                        deleteTimer={this.deleteTimer}
                        startTimer={this.startTimer}
                        stopTimer={this.stopTimer}
                    />
                    <ToggleableTimerForm submitForm={this.createTimer} />
                </div>
            </div>
        );
    }
}

class EditableTimerList extends React.Component {

    updateTimer = (timerId, newTitle, newProject) => {
        this.props.updateTimer(timerId, newTitle, newProject);
    }

    deleteTimer = (timerId) => {
        this.props.deleteTimer(timerId)
    }

    render() {
        const timers = this.props.timers.map((timer) => {
            return (
                <EditableTimer
                    key={timer.id}
                    id={timer.id}
                    title={timer.title}
                    project={timer.project}
                    elapsed={timer.elapsed}
                    runningSince={timer.runningSince}
                    updateTimer={this.updateTimer}
                    deleteTimer={this.deleteTimer}
                    startTimer={this.props.startTimer}
                    stopTimer={this.props.stopTimer}
                />
            );
        })
        return (
            <div id='timers'>
                {timers}
            </div>
        );
    }
}

class EditableTimer extends React.Component {
    state = { isFormOpen: false };

    openForm = () => {
        this.setState(Object.assign({}, this.state, { isFormOpen: true }));
    }

    closeForm = () => {
        this.setState(Object.assign({}, this.state, { isFormOpen: false }));
    }

    submitForm = (newTitle, newProject) => {
        this.props.updateTimer(this.props.id, newTitle, newProject);
        this.closeForm();
    }

    deleteTimer = () => {
        this.props.deleteTimer(this.props.id);
    }

    render() {
        if (this.state.isFormOpen) {
            return (
                <TimerForm
                    id={this.props.id}
                    title={this.props.title}
                    project={this.props.project}
                    closeForm={this.closeForm}
                    submitForm={this.submitForm}
                />
            );
        } else {
            return (
                <Timer
                    id={this.props.id}
                    title={this.props.title}
                    project={this.props.project}
                    elapsed={this.props.elapsed}
                    runningSince={this.props.runningSince}
                    openForm={this.openForm}
                    deleteTimer={this.deleteTimer}
                    onStartClick={this.props.startTimer}
                    onStopClick={this.props.stopTimer}
                />
            );
        }
    }

}

class Timer extends React.Component {

    //gets executed right after the components "mounts" i.e. gets added to the html
    componentDidMount() {
        this.forceUpdateInterval = setInterval(() => this.forceUpdate(), 50);
        /* forceUpdate(), when called on a React Component, forces the component to re-render itself */
    }

    //gets executed right before the component "un-mounts"
    ComponentWillUnmount() {
        clearInterval(this.forceUpdateInterval);
    }

    openForm = () => {
        this.props.openForm();
    }

    deleteTimer = () => {
        this.props.deleteTimer();
    }

    handleStartClick = () => {
        this.props.onStartClick(this.props.id);
    }

    handleStopClick = () => {
        this.props.onStopClick(this.props.id);
    }

    render() {
        const elapsedString = helpers.renderElapsedString(this.props.elapsed, this.props.runningSince);
        return (
            <div className='ui centered card'>
                <div className='content'>
                    <div className='header'>
                        {this.props.title}
                    </div>
                    <div className='meta'>
                        {this.props.project}
                    </div>
                    <div className='center aligned description'>
                        <h2>
                            {elapsedString}
                        </h2>
                    </div>
                    <div className='extra content'>
                        <span className='right floated edit icon' onClick={this.openForm}>
                            <i className='edit icon' />
                        </span>
                        <span className='right floated trash icon' onClick={this.deleteTimer}>
                            <i className='trash icon' />
                        </span>
                    </div>
                </div>
                <TimerActionButton
                    timerIsRunning={!!this.props.runningSince}
                    onStartClick={this.handleStartClick}
                    onStopClick={this.handleStopClick}
                />
            </div>
        );
    }
}

class TimerActionButton extends React.Component {
    render() {
        if (this.props.timerIsRunning) {
            return (
                <div
                    className='ui bottom attached red basic button'
                    onClick={this.props.onStopClick}
                >
                    Stop
                </div>
            );
        } else {
            return (
                <div
                    className='ui bottom attached green basic button'
                    onClick={this.props.onStartClick}
                >
                    Start
                </div>
            );
        }
    }
}

class TimerForm extends React.Component {
    state = {
        title: this.props.title || '',
        project: this.props.project || ''
    }

    handleTitleChange = (e) => {
        this.setState(Object.assign({}, this.state, { title: e.target.value }));
    }

    handleProjectChange = (e) => {
        this.setState(Object.assign({}, this.state, { project: e.target.value }))
    }

    closeForm = () => {
        this.props.closeForm();
    }

    submitForm = () => {
        this.props.submitForm(this.state.title, this.state.project);
    }

    render() {
        const submitText = this.props.id ? 'Update' : 'Create';

        return (
            <div className='ui centered card'>
                <div className='content'>
                    <div className='ui form'>
                        <div className='field'>
                            <label>Title</label>
                            <input type='text' value={this.state.title} onChange={this.handleTitleChange} />
                        </div>
                        <div className='field'>
                            <label>Project</label>
                            <input type='text' value={this.state.project} onChange={this.handleProjectChange} />
                        </div>
                        <div className='ui two bottom attached buttons'>
                            <button className='ui basic blue button' onClick={this.submitForm}>
                                {submitText}
                            </button>
                            <button className='ui basic red button' onClick={this.closeForm}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}



class ToggleableTimerForm extends React.Component {
    state = { isFormOpen: false };

    openForm = () => {
        this.setState(Object.assign({}, this.state, { isFormOpen: true }));
    }

    closeForm = () => {
        this.setState(Object.assign({}, this.state, { isFormOpen: false }))
    }

    submitForm = (newTitle, newProject) => {
        this.props.submitForm(newTitle, newProject);
        this.closeForm();
    }

    render() {
        if (this.state.isFormOpen) {
            return (
                <TimerForm submitForm={this.submitForm} />
            );
        } else {
            return (
                <div className='ui basic content center aligned segment'>
                    <button className='ui basic button icon' onClick={this.openForm}>
                        <i className='plus icon' />
                    </button>
                </div>
            );
        }
    }
}

ReactDOM.render(<TimerDashboard />, document.getElementById('content'));