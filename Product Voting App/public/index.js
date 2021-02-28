class ProductList extends React.Component {
	state = {
		products: []
	}
	componentDidMount() {
		this.setState({ products: Seed.products })
	}

	handleUpvote = (productId) => {
		const NewProducts = this.state.products.map((product) => {
			if(product.id === productId){
				return Object.assign({}, product, { votes : product.votes + 1 });
			}else{
				return product;
			}
		});
		this.setState({products : NewProducts});
	}

	render() {
		const productComponents = this.state.products.map((product) => {
			return (
				<Product
					key={"Product - " + product.id}
					id={product.id}
					title={product.title}
					description={product.description}
					url={product.url}
					votes={product.votes}
					submitterAvatarUrl={product.submitterAvatarUrl}
					productImageUrl={product.productImageUrl}
					onVote={this.handleUpvote}
				/>
			);
		});
		return <div className="ui unstackable items">{productComponents}</div>;
	}
}

class Product extends React.Component {

	handleUpvote = () => {
		this.props.onVote(this.props.id);
	}

	render() {
		return (
			<div className="item">
				<div className="image">
					<img src={this.props.productImageUrl} />
				</div>
				<div className="middle aligned content">
					<div className="header">
						<a onClick={this.handleUpvote}>
							<i className="large caret up icon" />
						</a>
						{this.props.votes}
					</div>
					<div className="description">
						<a>{this.props.title}</a>
						<p className="parag">{this.props.description}</p>
					</div>
					<div className="extra">
						<span>Submitted by:</span>
						<img
							className="ui avatar image"
							src={this.props.submitterAvatarUrl}
						/>
					</div>
				</div>
			</div>
		);
	}
}

ReactDOM.render(<ProductList />, document.getElementById("content"));
