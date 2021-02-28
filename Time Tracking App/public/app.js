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
        ],
    };

    changeTitle = (timerId, newTitle) => {
        this.setState(
            Object.assign(
                {},
                this.state,
                {
                    timers: this.state.timers.map((timer) => {
                        if (timer.id === timerId) {
                            return Object.assign({}, timer, { title: newTitle });
                        } else {
                            return timer;
                        }
                    })
                }
            )
        );
    }

    changeProject = (timerId, newProject) => {
        this.setState(
            Object.assign(
                {},
                this.state,
                {
                    timers: this.state.timers.map((timer) => {
                        if (timer.id === timerId) {
                            return Object.assign({}, timer, { project: newProject });
                        } else {
                            return timer;
                        }
                    })
                }
            )
        );
    };

    render() {
        return (
            <div className='ui three column centered grid'>
                <div className='column'>
                    <EditableTimerList timers={this.state.timers} changeTitle={this.changeTitle} changeProject={this.changeProject} />
                    <ToggleableTimerForm />
                </div>
            </div>
        );
    }
}

class ToggleableTimerForm extends React.Component {
    state = {
        isFormOpen: false
    }

    handleFormOpen = () => {
        this.setState({ isFormOpen: true });
    }

    handleFormQuit = () => {
        this.setState({ isFormOpen: false });
    }

    render() {
        if (this.state.isFormOpen) {
            return (
                <TimerForm onFormSubmit={this.handleFormQuit} onFormCancel={this.handleFormQuit} />
            );
        } else {
            return (
                <div className='ui basic content center aligned segment'>
                    <button className='ui basic button icon' onClick={this.handleFormOpen}>
                        <i className='plus icon' />
                    </button>
                </div>
            );
        }
    }
}

class EditableTimerList extends React.Component {

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
                    changeTitle={this.props.changeTitle}
                    changeProject={this.props.changeProject}
                />
            );
        })
        return (
            <div id="timers">
                {timers}
            </div>
        );
    }
}

class EditableTimer extends React.Component {
    state = {
        isFormOpen: true
    };

    onFormSubmit = () => {
        this.setState({ isFormOpen: false });
    }

    formOpen = () => {
        this.setState({ isFormOpen: true });
    }

    handleTitleChange = (newTitle) => {
        this.props.changeTitle(this.props.id, newTitle);
    };

    handleProjectChange = (newProject) => {
        this.props.changeProject(this.props.id, newProject);
    };

    render() {
        if (this.state.isFormOpen) {
            return (
                <TimerForm
                    id={this.props.id}
                    title={this.props.title}
                    project={this.props.project}
                    elapsed={this.props.elapsed}
                    runningSince={this.props.runningSince}
                    onFormSubmit={this.onFormSubmit}
                    handleTitleChange={this.handleTitleChange}
                    handleProjectChange={this.handleProjectChange}
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
                    formOpen={this.formOpen}
                />
            );
        }
    }
}

class Timer extends React.Component {
    render() {
        const elapsedString = helpers.renderElapsedString(this.props.elapsed);
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
                        <span className='right floated edit icon'>
                            <i className='edit icon' onClick={this.props.formOpen} />
                        </span>
                        <span className='right floated trash icon'>
                            <i className='trash icon' />
                        </span>
                    </div>
                </div>
                <div className='ui bottom attached blue basic button'>
                    Start
                </div>
            </div>
        );
    }
}

class TimerForm extends React.Component {
    state = {
        title: this.props.title || '',
        project: this.props.project || ''
    };

    handleTitleChange = (e) => {
        this.props.handleTitleChange(e.target.value);
        this.setState(Object.assign({}, this.state, { title: e.target.value }));
    };

    handleProjectChange = (e) => {
        this.props.handleProjectChange(e.target.value);
        this.setState(Object.assign({}, this.state, { project: e.target.value }));
    };

    handleFormSubmit = () => {
        this.props.onFormSubmit()
    };

    render() {
        const submitText = this.props.id ? 'Update' : 'Create';
        return (
            <div className='ui centered card'>
                <div className='content'>
                    <div className='ui form'>
                        <div className='field'>
                            <label>Title</label>
                            <input
                                type='text'
                                value={this.state.title}
                                onChange={this.handleTitleChange}
                            />
                        </div>
                        <div className='field'>
                            <label>Project</label>
                            <input
                                type='text'
                                value={this.state.project}
                                onChange={this.handleProjectChange}
                            />
                        </div>
                        <div className='ui two bottom attached buttons'>
                            <button className='ui basic blue button' onClick={this.handleFormSubmit}>
                                {submitText}
                            </button>
                            <button className='ui basic red button'>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        );

    }
}

ReactDOM.render(<TimerDashboard />, document.getElementById("content"));