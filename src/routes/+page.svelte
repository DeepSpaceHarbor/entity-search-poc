<script lang="ts">
	import CrocNoris from '$lib/assets/crocNoris.webp';
	import PonyStark from '$lib/assets/ponyStark.webp';
</script>

<div class="flex h-screen items-center justify-center bg-base-200">
	<div class="min-w-[30%] rounded-2xl p-6">
		<div class="chat-receiver chat">
			<div class="chat-avatar avatar">
				<div class="size-16 rounded-full">
					<img src={PonyStark} alt="avatar" />
				</div>
			</div>
			<div class="chat-header text-base-content">
				Pony Stark
				<time class="text-base-content/50">12:45</time>
			</div>
			<div class="chat-bubble">I would like to make an outbound list today</div>
			<div class="chat-footer text-base-content/50">
				<div>Delivered</div>
			</div>
		</div>
		<div class="chat-sender chat">
			<div class="chat-avatar avatar">
				<div class="size-16 rounded-full">
					<img src={CrocNoris} alt="avatar" />
				</div>
			</div>
			<div class="chat-header text-base-content">
				Croc Norris
				<time class="text-base-content/50">12:46</time>
			</div>
			<div class="chat-bubble">Are you looking for people or companies?</div>
			<div class="chat-footer text-base-content/50">
				Seen
				<span class="icon-[tabler--checks] align-bottom text-success"></span>
			</div>
		</div>
		<div class="chat-receiver chat">
			<div class="chat-avatar avatar">
				<div class="size-16 rounded-full">
					<img src={PonyStark} alt="avatar" />
				</div>
			</div>
			<div class="chat-header text-base-content">
				Pony Stark
				<time class="text-base-content/50">12:45</time>
			</div>
			<div class="chat-bubble">Let's start with people</div>
			<div class="chat-footer text-base-content/50">
				<div>Delivered</div>
			</div>
		</div>
		<div class="chat-sender chat">
			<div class="chat-avatar avatar">
				<div class="size-16 rounded-full">
					<img src={CrocNoris} alt="avatar" />
				</div>
			</div>
			<div class="chat-header text-base-content">
				Croc Norris
				<time class="text-base-content/50">12:46</time>
			</div>
			<div class="chat-bubble">
				Sure, here's the link 👇 <br />
				<a href="./people" class="btn btn-gradient">People search</a>
			</div>
			<div class="chat-footer text-base-content/50">
				Seen
				<span class="icon-[tabler--checks] align-bottom text-success"></span>
			</div>
		</div>
		<div class="chat-receiver chat">
			<div class="chat-avatar avatar">
				<div class="size-16 rounded-full">
					<img src={PonyStark} alt="avatar" />
				</div>
			</div>
			<div class="chat-header text-base-content">
				Pony Stark
				<time class="text-base-content/50">12:45</time>
			</div>
			<div class="chat-bubble">What about companies?</div>
			<div class="chat-footer text-base-content/50">
				<div>Delivered</div>
			</div>
		</div>
		<div class="chat-sender chat">
			<div class="chat-avatar avatar">
				<div class="size-16 rounded-full">
					<img src={CrocNoris} alt="avatar" />
				</div>
			</div>
			<div class="chat-header text-base-content">
				Croc Norris
				<time class="text-base-content/50">12:46</time>
			</div>
			<div class="chat-bubble">
				I've got you covered! <br />
				<a class="btn btn-gradient" href="./companies">Company search</a> <br />
			</div>
			<div class="chat-footer text-base-content/50">
				Seen
				<span class="icon-[tabler--checks] align-bottom text-success"></span>
			</div>
		</div>
		<div class="chat-sender chat">
			<div class="chat-avatar avatar">
				<div class="size-16 rounded-full">
					<img src={CrocNoris} alt="avatar" />
				</div>
			</div>
			<div class="chat-header text-base-content">
				Croc Norris
				<time class="text-base-content/50">12:46</time>
			</div>
			<div class="chat-bubble">
				Let me know if you need more help before my third coffee wears off.
			</div>
			<div class="chat-footer text-base-content/50">
				Seen
				<span class="icon-[tabler--checks] align-bottom text-success"></span>
			</div>
		</div>
	</div>
</div>
