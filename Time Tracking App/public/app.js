class TimerDashboard extends React.Component {
    state = {
        timers: [
            {
                title: 'Practice squat',
                project: 'Gym Chores',
                id: uuid.v4(),
                elapsed: 5456099,
                runningSince: Date.now(),
            },
            {
                title: 'Bake squash',
                project: 'Kitchen Chores',
                id: uuid.v4(),
                elapsed: 1273998,
                runningSince: null,
            }
        ]
    }

    updateTimer = (timerId, newTitle, newProject) => {
        this.setState(
            Object.assign(
                {},
                this.state,
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
            )
        );
    }

    createTimer = (newTitle, newProject) => {
        const newTimer = helpers.newTimer({ title: newTitle, project: newProject });
        this.setState(
            Object.assign(
                {},
                this.state,
                {
                    timers: this.state.timers.concat(newTimer)
                }
            )
        );
    }

    deleteTimer = (timerId) => {
        this.setState(
            Object.assign(
                {
                    timers: this.state.timers.filter(timer => timer.id !== timerId)
                }
            )
        );
    }

    render() {
        return (
            <div className='ui three column centered grid'>
                <div className='column'>
                    <EditableTimerList
                        timers={this.state.timers}
                        updateTimer={this.updateTimer}
                        deleteTimer={this.deleteTimer}
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
                />
            );
        }
    }

}

class Timer extends React.Component {

    //gets executed right after the components "mounts" i.e. gets added to the html
    componentDidMount() {
        this.forceUpdateInterval = setInterval(this.forceUpdate(), 50); 
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
                <div className='ui bottom attached blue basic button'>Start</div>
            </div>
        );
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
                <TimerForm submitForm={this.submitForm}/>
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