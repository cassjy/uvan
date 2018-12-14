<template>
	<div class="SharingRecords" ref="BSscroll">
		<div class="scrollBox">
			<div class="wrapper" v-for="(item,index) in datalist" @click="showAll(index)" :key="index" :id="index">
				<!-- <block wx:for="{{listData}}" wx:key="index" wx:for-item="item"> -->
				<div class="userInfo">
					<div class="show">
						<div class="touxiang">
							<img class="img" :src="item.ImageUrl"></img>
						</div>
						<div class="info">
							<div class="up">
								<div class="name">{{item.NickName}}</div>
								<div class="effect" v-if="fromWhere&& mark !='toInvalidRecord'">{{item.Status}}</div>
								<div class="effect" v-if="!fromWhere && effectday[index] != '-1' && mark !='toInvalidRecord' ">剩余有效：{{effectday[index]}}天</div>
								<div class="effect" v-if="!fromWhere && effectday[index] == '-1'&& mark !='toInvalidRecord'">剩余有效：已过期</div>
								<div class="effect" v-if="mark=='toInvalidRecord'">{{item.UserType}}</div>
							</div>
							<div class="dowm">
								<div class="fwDate"> 访问时间：{{item.VisitTime}} </div>
								<div class="category" v-if="mark !='toInvalidRecord'">{{item.UserType}}</div>
							</div>
						</div>
					</div>
					<div class="hideen" v-show="listID==index">
						<div class="sxDate" v-if="mark !='toInvalidRecord'"> 失效时间：{{item.InvalidTime}}</div>
						<div class="belong" v-if="fromWhere">所属蒲公英：{{item.BelongName}}</div>
						<div class="deadLine" v-if="fromWhere">保护截止期：{{item.ProtectionEndTime}}</div>
					</div>
					<div class="iconfont" v-bind:class="{'icon-shang2': isShang&&id==index, 'icon-xia2':isXia||id!=index}"></div>
				</div>
			</div>
		</div>
		<!--没有更多  -->
		<!--	<div class="noMore">——— 没有更多了 ———</div>-->
	</div>
</template>
<script>
	import BScroll from 'better-scroll'
	var page = 1;
	var count = 10;
	export default {
		props: [
			'datalist',
			'fromWhere',
			'effectday',
			'mark',
			'touchTab'
		],
		data() {
			return {
				isXia: true,
				isShang: false,
				listID: 'null',
				id: '',
				state: ''
			}
		},
		created() {
			this.$nextTick(() => {
				this.initScroll()
			})
		},
		mounted() {
			//  this.requireShareData();
			console.log('测试数据')
		},
		methods: {
			// 点击记录展示所以信息
			showAll(index) {
				console.log(`该ID=${index}`)
				// 获取历史id
				console.log(`历史ID=${this.listID}`)
				var hisId = this.listID
				var nowId = index
				this.id = index
				if(nowId == hisId) {
					this.listID = 'null'
					this.isShang = false
					this.isXia = true
				} else {
					this.listID = index
					this.isShang = true
					this.isXia = false
				}

			},
			update() {
				console.log('我要更新listID')
				this.listID = 'null'
			},
			initScroll() {
				if(!this.$refs.BSscroll) return
				let options = {
					probeType: 3,
					click: true,
					pullUpLoad: true,
					pullDownRefresh: {
						threshold: 50, // 当下拉到超过顶部 50px 时，触发 pullingDown 事件
						stop: 0 //刷新数据的过程中，回弹停留在距离顶部还有 0px 的位置
					},
					pullUpLoad: {
						threshold: 0 // 在上拉到超过底部 0 时，触发 pullingUp 事件
					},
				}

				this.goodsListWrapper = new BScroll(this.$refs.BSscroll, options)
				this.goodsListWrapper.on('pullingUp', () => {
					console.log('121212pullingUp')
					this.$emit('pullingUp')
				})

				this.goodsListWrapper.on('pullingDown', () => { // 下拉刷新
					console.log('测试pullingDown')
					this.$emit('pullingDown')

				})
			},
			refresh() {
				this.goodsListWrapper && this.goodsListWrapper.finishPullUp()
				this.goodsListWrapper && this.goodsListWrapper.refresh()
			}
		}
	}
</script>
<style lang="less" scoped>
	@import '../../../common/css/defult.less';
	.fade-enter-active,
	.fade-leave-active {
		transition: all 0.5s;
	}
	
	.fade-enter,
	.fade-leave-to {
		opacity: 0;
	}
	
	.SharingRecords {
		z-index: 10;
		height: 100%;
		overflow: hidden;
		background: #F2F2F7;
		// padding-bottom: 10%;
	}
	
	.scrollBox {
		min-height: 100%;
	}
	
	.wrapper {
		background-color: #fff;
		/*margin-bottom: 15/@rem;*/
		border-bottom: 2/@rem solid #efebeb;
		.userInfo {
			color: #000;
			padding: 20/@rem 30/@rem 30/@rem 30/@rem;
			box-sizing: border-box;
			border-bottom: 2/@rem solid #efebeb;
			position: relative;
			.show {
				display: flex;
				flex-direction: row;
				align-items: center;
				.touxiang {
					width: 80/@rem;
					height: 80/@rem;
					margin-right: 18/@rem;
					.img {
						width: 80/@rem;
						height: 80/@rem;
						border-radius: 50%;
					}
				}
				.info {
					width: 85%;
					font-size: 28/@rem;
					.up {
						display: flex;
						justify-content: space-between;
						/* flex-direction: row; */
						.name {
							flex: 2;
							text-align: left;
						}
						.effect {
							/*flex: 1;*/
							text-align: right;
							padding-right: 8/@rem;
						}
					}
					.dowm {
						margin-top: 14/@rem;
						display: flex;
						justify-content: space-between;
						.category {
							text-align: right;
						}
						.fwDate {
							flex: 1;
							font-size: 24/@rem;
							margin-bottom: 8/@rem;
						}
					}
				}
			}
			.hideen {
				padding-left: 98/@rem;
				.sxDate {
					font-size: 24/@rem;
					margin-bottom: 8/@rem;
				}
				.belong {
					font-size: 24/@rem;
					margin-bottom: 8/@rem;
				}
				.deadLine {
					font-size: 24/@rem;
				}
			}
			.icon-xia2,
			.icon-shang2 {
				position: absolute;
				color: #cdcdcd;
				bottom: -8rpx;
				left: 50%;
			}
		}
		.userInfo:last-child {
			border-bottom: none;
		}
	}
	/*没有更多记录  */
	
	.noMore {
		width: 100%;
		color: #a4a8ab;
		font-size: 24rpx;
		text-align: center;
		margin: 20rpx 0;
	}
	
	.public {
		display: flex;
		flex-direction: row;
		align-items: center;
		.tab {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 20/@rem 0;
		}
	}
	
	.change {
		color: #969595;
	}
	
	.info .dowm .sxDate {
		margin-bottom: 8/@rem;
	}
	
	.right .num {
		font-size: 28/@rem;
	}
</style>