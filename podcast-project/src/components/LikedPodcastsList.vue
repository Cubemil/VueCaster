<template>
	<div id="liked-podcast-list-container">
		<h3 v-if="!isCollapsed">Liked Podcasts</h3>
		<ul id="liked-podcasts-list">
			<li v-for="podcast in likedPodcasts" :key="podcast.id" class="liked-podcast-item">
				<router-link 
					:to="{ 
						name: 'PodcastView',
						params: { podcastId: podcast.id }}"
					class="liked-podcast-link"
				>
					<img 
						v-if="!isCollapsed"
						:src="podcast.imgURL"
						alt="Podcast Image"
						class="podcast-image"
					>
					<span v-if="!isCollapsed">{{ podcast.title }}</span>
				</router-link>
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	props: {
		isCollapsed: { type: Boolean, default: false }
	},
	data() {
		return {
			likedPodcasts: [],
			isLoading: false,
			errorMessage: ''
		}
	},
	mounted() {
		this.loadLikedPodcasts()
		window.addEventListener('storage', this.handleStorageChange)
	},
	beforeUnmount() {
		window.removeEventListener('storage', this.handleStorageChange)
	},
	methods: {
		loadLikedPodcasts() {
			const likedPodcastIds = JSON.parse(localStorage.getItem('likedPodcasts') || '[]')
			if (likedPodcastIds.length > 0) {
				this.fetchLikedPodcasts(likedPodcastIds)
			} else {
				this.likedPodcasts = []
			}
		},
		async fetchLikedPodcasts(podcastIds) {
			this.isLoading = true
			this.errorMessage = ''

			try {
				const podcasts = await Promise.all(podcastIds.map(async id => {
					let url = new URL('https://api.fyyd.de/0.2/podcast/')
					url.searchParams.append('podcast_id', id)

					const response = await fetch(url)
					if (!response.ok) {
						throw new Error('Network response was not ok')
					}

					const body = await response.json()
					return {
						id: body.data.id,
						title: body.data.title,
						imgURL: body.data.imgURL,
						artist: body.data.author
					}
				}))

				this.likedPodcasts = podcasts
			} catch (error) {
				this.errorMessage = error.message
			} finally {
				this.isLoading = false
			}
		},
		handleStorageChange(event) {
			if (event.key === 'likedPodcasts') {
				this.loadLikedPodcasts()
			}
		}
	}

}
</script>

<style scoped>
#liked-podcast-list-container {
  margin-top: 1rem;
  border-top: 1px solid #B3B3B3;
}

#liked-podcast-list-container h3 {
	color: #B3B3B3;
	font-size: 1.5em;
}

#liked-podcasts-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.liked-podcast-item {
  margin-bottom: 1em;
	transition: all 0.3s;
}

.liked-podcast-item:last-child {
	margin-bottom: 0;
	border-bottom: none;
}

.liked-podcast-item:hover {
	transform: scale(1.05);
}

.liked-podcast-link {
  display: flex;
  align-items: center;
  color: #B3B3B3;
  text-decoration: none;
}

.liked-podcast-link:hover {
	color: #fff;
}

.linked-podcast-image:hover {
	opacity: 0.8;
}

.podcast-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  margin-right: 5%;
}

@media screen and (max-width: 1024px) {
	.podcast-image {
		width: 60px;
		height: 60px;
	}
}

@media screen and (max-width: 768px) {
  #liked-podcasts-container {
    padding: 0;
  }
  .podcast-image {
    width: 30px;
    height: 30px;
  }
}

</style>