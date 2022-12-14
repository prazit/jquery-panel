<?php 
/* wait time simulation */
for($i=1; $i<90000; $i++) {
	$sim = ($i * 99999 ).' decimal '.($i * $i);
}
?>

		<!-- page -->
		<div class="column column-1-2--mm column-1-3--ml column-1-4--mx draw-outside">
		<div id="sweep-item-scope" class="height--x200 margin--x10 padding--x10 shadow rounded--x5 background--c3 draw-outside">
			<h2 class="right-symbol sym-angle-right">Animation by Sweep</h2>			
			<div class="fit-width fit-height draw-outside">
				<span id="sweep-item-1" class="on-center no-text sym-apple symbol--x4 symbol--c2"></span>
				<span id="sweep-item-2" class="panel-open button on-center no-text sym-windows symbol--x4 symbol--c1"></span>
				<span id="sweep-item-3" class="on-center no-text sym-android symbol--x4 symbol--c5"></span>
			</div>
			<div class="panel-open button on-top-right margin--x-10 circle--x32 background--c4 shadow">
				<span id="spot" class="on-center no-text symbol sym-plus symbol--c3 trans--x2"></span>
			</div>
		</div>
		</div>
		
		<div class="column column-1-2--ms column-1-3--ml column-1-4--mx">
		<div class="height--x200 margin--x10 padding--x10 shadow rounded--x5 background--c3">
			<h2 class="right-symbol sym-angle-right">CONTENT</h2>
			<p>This is area for anything you want.</p>
			<span>This is area for anything you want.</span>
			<br><br>
			This is area for anything you want.
			<div class="on-top-right">
				<div class="button border panel-open margin--x10 padding--x10 left-symbol sym-align-justify background--c3">
					<span>MENU</span>
				</div>
			</div>
		</div>
		</div>
		
		<div class="column column-1-2--ms column-1-1--mm column-1-3--ml column-1-4--mx">
		<div class="height--x200 margin--x10 padding--x10 shadow rounded--x5 background--c3">
			<h2 class="right-symbol sym-angle-right">CONTENT</h2>
			<p>This is area for anything you want.</p>
			<span>This is area for anything you want.</span>
			<br><br>
			This is area for anything you want.
			<div class="on-top-right">
				<div class="button rounded--x5 panel-open rounded--x5 margin--x10 padding--x10 left-symbol sym-power-off background--c0">MENU</div>
			</div>
		</div>
		</div>
		
		<div class="column column-1-4--mx">
		<div class="height--x200 margin--x10 padding--x10 shadow rounded--x5 background--c3 show-outside">
			<h2 class="right-symbol sym-angle-right">CONTENT</h2>
			<p>This is area for anything you want.</p>
			<span>This is area for anything you want.</span>
			<br><br>
			This is area for anything you want.
			<div class="top-right-child on-top-right">
				<div class="button panel-open marin--x10 padding--x5 left-symbol sym-bars"><span>MENU</span></div>
			</div>
		</div>
		</div>
		
		<!-- panel and drilldown -->
		<div class="panel hidden">
		<div class="columns fit-height background--c5"><!-- container of drilldown will become relative position but the panel need the fixed position then inner is needed -->
			
			<!-- panel footer -->
			<small class="inline-column on-bottom-right padding--x10 text--c4">
				<span style="vertical-align:sub;">jQuery for Appanel</span><small>&nbsp;&reg;</small>
			</small>
			
			<!-- home/root of drilldown -->
			<div class="drilldown column"><!-- drilldown and sub will become absolute position -->
			<div class="inner shadow rounded--x5 h6 margin--x10 background--c4">
				
				<div class="rounded--x5 top-child center-text padding--x10 text--c3">
					<a class="panel-close button on-left left-margin--x10 symbol sym-bars" href="#">&nbsp;</a>
					<span class="symbol sym-home flip-horizontal--x180"></span>
					<b>o m e</b>
				</div>
				
				<div class="child border-top padding--x10 text--c5" id="header"></div>
				
				<a class="child border-top ellipsis left-symbol sym-external-link padding--x10 background--c0 text--c5" href="inout.php">InOut <b class="text--c4">(scroll triggers)</b></a>
				
				<div class="child border-top ellipsis left-text right-symbol sym-chevron-right top-padding--x10 bottom-padding--x10 padding--x5 background--c0 text--c5">
					<!-- next button, must use clickable tag like <a> -->
					<a class="next block" href="#" alt="Pure panel" title="Pure panel">Panel</a>
					<!-- sub drilldown, show when click on next button in the same parent -->
					<div class="sub column">
					<div class="inner shadow rounded--x5 h6 margin--x10 background--c4">
						<!-- back button, must use clickable tag like <a> -->
						<div class="rounded--x5 top-child center-text padding--x10 text--c3">
							<a class="back button on-left left-margin--x10 symbol sym-chevron-left" href="#">&nbsp;</a>
							<span class="symbol sym-bars symbol--c5"></span>
							PANEL
							<span class="symbol sym-bars symbol--c5"></span>
						</div>
						<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="panel-leftside.php"><b>Left</b> Panel</a>
						<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="panel-rightside.php"><b>Right</b> Panel</a>
						<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="panel-doubleside.php"><b>Double</b> Panel</a>
						<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="panel-topside.php"><b>Top</b> Panel</a>
						<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="panel-bottomside.php"><b>Bottom</b> Panel</a>
						<div class="bottom-child left-symbol sym-info-circle border-top padding--x10 text--c5">
							click back button to go back 1 level
						</div>
					</div>
					</div>
				</div>
				
				<div class="child border-top ellipsis left-text right-symbol sym-chevron-right top-padding--x10 bottom-padding--x10 padding--x5 background--c0 text--c5">
					<a class="next block" href="#" alt="Panel with sweep" title="Panel with sweep">Panel with sweep</a>
					<div class="sub column">
					<div class="inner shadow rounded--x5 h6 margin--x10 background--c4">
						<div class="rounded--x5 top-child center-text padding--x10 text--c3">
							<a class="back button on-left left-margin--x10 symbol sym-chevron-left" href="#">&nbsp;</a>
							<span class="symbol sym-bars symbol--c5"></span>
							SWEEP PANEL
							<span class="symbol sym-bars symbol--c5"></span>
						</div>
						<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="panel-sweep-leftside.php"><b>Left</b> Panel with Sweep</a>
						<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="panel-sweep-rightside.php"><b>Right</b> Panel with Sweep</a>
						<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="panel-sweep-topside.php"><b>Top</b> Panel with Sweep</a>
						<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="panel-sweep-bottomside.php"><b>Bottom</b> Panel with Sweep</a>
						<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="panel-sweep-center.php"><b>Center</b> Panel with Sweep</a>
						<div class="bottom-child left-symbol sym-info-circle border-top padding--x10 text--c5">
							click back button to go back 1 level
						</div>
					</div>
					</div>
				</div>
				
				<div class="child border-top ellipsis left-text right-symbol sym-chevron-right top-padding--x10 bottom-padding--x10 padding--x5 background--c0 text--c5">
					<a class="next block" href="#" alt="Pure sweep" title="Pure sweep">Sweep</a>
					<div class="sub column">
					<div class="inner shadow rounded--x5 h6 margin--x10 background--c4">
						<div class="rounded--x5 top-child center-text padding--x10 text--c3">
							<a class="back button on-left left-margin--x10 symbol sym-chevron-left" href="#">&nbsp;</a>
							<span class="symbol sym-bars symbol--c5"></span>
							SWEEP
							<span class="symbol sym-bars symbol--c5"></span>
						</div>
						<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="sweep-chains.php"><b>Inline</b> Panel using Pure Sweep</a>
						<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="sweep.php"><b>Right</b> Panel using Pure Sweep</a>
						<div class="bottom-child left-symbol sym-info-circle border-top padding--x10 text--c5">
							click back button to go back 1 level
						</div>
					</div>
					</div>
				</div>
				
				<div class="child border-top ellipsis left-text right-symbol sym-chevron-right top-padding--x10 bottom-padding--x10 padding--x5 background--c0 text--c5">
					<a class="next block" href="#" alt="Drilldown" title="Drilldown">Drilldown</a>
					<div class="sub column">
					<div class="inner shadow rounded--x5 h6 margin--x10 background--c4">
						<div class="rounded--x5 top-child center-text padding--x10 text--c3">
							<a class="back button on-left left-margin--x10 symbol sym-chevron-left" href="#">&nbsp;</a>
							<span class="symbol sym-bars symbol--c5"></span>
							DRILLDOWN
							<span class="symbol sym-bars symbol--c5"></span>
						</div>
						<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="drilldown-basic.php"><b>Basic</b>&nbsp;Drilldown</a>
						<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="drilldown-sweep.php">Drilldown with <b>Sweep #1</b></a>
						<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="drilldown-sweep.php?sweep=2">Drilldown with <b>Sweep #2</b></a>
						<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="drilldown-sweep.php?sweep=3">Drilldown with <b>Sweep #3</b></a>
						<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="drilldown-live.php">Drilldown with <b>Sweep and Live</b></a>
						<div class="rounded--x5 child center-text padding--x10 text--c3">
							<span class="symbol sym-bars symbol--c5"></span>
							LIVE & IFRAME
							<span class="symbol sym-bars symbol--c5"></span>
						</div>
						<div class="child border-top ellipsis left-text right-symbol sym-chevron-right top-padding--x10 bottom-padding--x10 padding--x5 background--c0 text--c5">
							<a class="next block" href="#" alt="Drilldown" title="Drilldown">Live Drilldown</a>
							<div class="sub column">
								<div class="live scrollable inner shadow rounded--x5 h6 margin--x10 background--c4 background--c0 opacity--x20" style="min-height:100px;" src="live/sub-panel.php">
									<div class="rounded--x5 top-child center-text padding--x10 text--c3">
										<a class="back button on-left left-margin--x10 symbol sym-chevron-left" href="#">&nbsp;</a>
										LIVE LOADING...
									</div>
									<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="drilldown-live.php">Drilldown with <b>Sweep and Live</b></a>
									<div class="rounded--x5 bottom-child center-text padding--x10 text--c3">
										This will work only on Live Drilldown Page, if you can see this message please click the link above or back.   
									</div>								
								</div>
							</div>
						</div>
						<div class="child border-top ellipsis left-text right-symbol sym-chevron-right top-padding--x10 bottom-padding--x10 padding--x5 background--c0 text--c5">
							<a class="next block" href="#" alt="Drilldown" title="Drilldown">Drilldown + iframe content</a>
							<div class="sub column fit-height">
								<div class="fit-height rounded--x5 h6 margin--x10 background--c4">
									<div class="height--x30 rounded--x5 top-child center-text text--c3">
										<a class="back button on-left left-margin--x10 symbol sym-chevron-left" href="#">&nbsp;</a>
										<span>IFRAME</span>
									</div>
									<div class="fit-height--x30 child center-text background--c0 text--c3">
										<div class="iframe fit-width fit-height" src="live/content.php">
										This will work only on Live Drilldown Page, if you can see this message please click the link above or back.
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="bottom-child left-symbol sym-info-circle border-top padding--x10 text--c5">
							click back button to go back 1 level
						</div>
					</div>
					</div>
				</div>
				
				<div class="child border-top ellipsis left-text right-symbol sym-chevron-right top-padding--x10 bottom-padding--x10 padding--x5 background--c0 text--c5">
					<a class="next block" href="#" alt="All in one" title="All in one">All above</a>
					
					<!-- folders panel -->
					<div class="sub column scrollable">
					<div class="inner rounded--x5 shadow h6 margin--x10 background--c4">
					
						<div class="rounded--x5 top-child center-text padding--x10 text--c3">
							<a class="back button on-left left-margin--x10 symbol sym-chevron-left" href="#">&nbsp;</a>
							<span class="symbol sym-bars symbol--c5"></span>
							SUB PANEL
							<span class="symbol sym-bars symbol--c5"></span>
						</div>
						
						<div class="child border-top ellipsis left-text right-symbol sym-chevron-right top-padding--x10 bottom-padding--x10 padding--x5 background--c0 text--c5">
							<!-- next button, must use clickable tag like <a> -->
							<a class="next block" href="#" alt="Pure panel without sweep" title="Pure panel without sweep">Pure panel</a>
							<!-- sub drilldown, show when click on next button in the same parent -->
							<div class="sub column">
							<div class="inner shadow rounded--x5 h6 margin--x10 background--c4">
								<!-- back button, must use clickable tag like <a> -->
								<div class="rounded--x5 top-child center-text padding--x10 text--c3">
									<a class="back button on-left left-margin--x10 symbol sym-chevron-left" href="#">&nbsp;</a>
									<span class="symbol sym-bars symbol--c5"></span>
									PANEL
									<span class="symbol sym-bars symbol--c5"></span>
								</div>
								<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="panel-leftside.php"><b>Left</b> Panel</a>
								<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="panel-rightside.php"><b>Right</b> Panel</a>
								<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="panel-doubleside.php"><b>Double</b> Panel</a>
								<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="panel-topside.php"><b>Top</b> Panel</a>
								<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="panel-bottomside.php"><b>Bottom</b> Panel</a>
								<div class="bottom-child left-symbol sym-info-circle border-top padding--x10 text--c5">
									click back button to go back 1 level
								</div>
							</div>
							</div>
						</div>
						
						<div class="child border-top ellipsis left-text right-symbol sym-chevron-right top-padding--x10 bottom-padding--x10 padding--x5 background--c0 text--c5">
							<a class="next block" href="#" alt="Panel with sweep" title="Panel with sweep">Panel with sweep</a>
							<div class="sub column">
							<div class="inner shadow rounded--x5 h6 margin--x10 background--c4">
								<div class="rounded--x5 top-child center-text padding--x10 text--c3">
									<a class="back button on-left left-margin--x10 symbol sym-chevron-left" href="#">&nbsp;</a>
									<span class="symbol sym-bars symbol--c5"></span>
									SWEEP PANEL
									<span class="symbol sym-bars symbol--c5"></span>
								</div>
								<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="panel-sweep-leftside.php"><b>Left</b> Panel with Sweep</a>
								<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="panel-sweep-rightside.php"><b>Right</b> Panel with Sweep</a>
								<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="panel-sweep-topside.php"><b>Top</b> Panel with Sweep</a>
								<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="panel-sweep-bottomside.php"><b>Bottom</b> Panel with Sweep</a>
								<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="panel-sweep-center.php"><b>Center</b> Panel with Sweep</a>
								<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="panel-sweep-vertical-center.php"><b>Vertical</b> Panel using Top</a>
								<div class="bottom-child left-symbol sym-info-circle border-top padding--x10 text--c5">
									click back button to go back 1 level
								</div>
							</div>
							</div>
						</div>
						
						<div class="child border-top ellipsis left-text right-symbol sym-chevron-right top-padding--x10 bottom-padding--x10 padding--x5 background--c0 text--c5">
							<a class="next block" href="#" alt="Pure sweep without panel" title="Pure sweep without panel">Pure sweep</a>
							<div class="sub column">
							<div class="inner shadow rounded--x5 h6 margin--x10 background--c4">
								<div class="rounded--x5 top-child center-text padding--x10 text--c3">
									<a class="back button on-left left-margin--x10 symbol sym-chevron-left" href="#">&nbsp;</a>
									<span class="symbol sym-bars symbol--c5"></span>
									SWEEP
									<span class="symbol sym-bars symbol--c5"></span>
								</div>
								<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="sweep-chains.php"><b>Inline</b> Panel using Pure Sweep</a>
								<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="sweep.php"><b>Right</b> Panel using Pure Sweep</a>
								<div class="bottom-child left-symbol sym-info-circle border-top padding--x10 text--c5">
									click back button to go back 1 level
								</div>
							</div>
							</div>
						</div>
						
						<div class="child border-top ellipsis left-text right-symbol sym-chevron-right top-padding--x10 bottom-padding--x10 padding--x5 background--c0 text--c5">
							<a class="next block" href="#" alt="Drilldown" title="Drilldown">Drilldown</a>
							<div class="sub column">
							<div class="inner shadow rounded--x5 h6 margin--x10 background--c4">
								<div class="rounded--x5 top-child center-text padding--x10 text--c3">
									<a class="back button on-left left-margin--x10 symbol sym-chevron-left" href="#">&nbsp;</a>
									<span class="symbol sym-bars symbol--c5"></span>
									DRILLDOWN
									<span class="symbol sym-bars symbol--c5"></span>
								</div>
								<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="drilldown-basic.php"><b>Basic</b>&nbsp;Drilldown</a>
								<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="drilldown-sweep.php">Drilldown with <b>Sweep #1</b></a>
								<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="drilldown-sweep.php?sweep=2">Drilldown with <b>Sweep #2</b></a>
								<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="drilldown-sweep.php?sweep=3">Drilldown with <b>Sweep #3</b></a>
								<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="drilldown-live.php">Drilldown with <b>Sweep and Live</b></a>
								<div class="bottom-child left-symbol sym-info-circle border-top padding--x10 text--c5">
									click back button to go back 1 level
								</div>
							</div>
							</div>
						</div>
					
						<div class="folder">
							<div class="rounded--x5 top-child center-text padding--x10 text--c3">
								<a class="back button on-left left-margin--x10 symbol sym-chevron-left" href="#">&nbsp;</a>
								<span class="symbol sym-bars symbol--c5"></span>
								LIVE FOLDER
								<span class="symbol sym-bars symbol--c5"></span>
								<span class="open button on-right right-margin--x10 symbol--x2 sym-chevron-circle-down symbol--c0"></span>
								<span class="hidden close button on-right right-margin--x10 symbol--x2 sym-chevron-circle-up symbol--c0"></span>
							</div>
							<div class="folder-content hidden background--c3 opacity--x20" style="min-height:100px;" src="live/sub-folders.php"></div>
						</div>
					
						<div class="folder">
							<div class="rounded--x5 top-child center-text padding--x10 text--c3">
								<a class="back button on-left left-margin--x10 symbol sym-chevron-left" href="#">&nbsp;</a>
								<span class="symbol sym-bars symbol--c5"></span>
								PANEL
								<span class="symbol sym-bars symbol--c5"></span>
								<span class="open button on-right right-margin--x10 symbol--x2 sym-chevron-circle-down symbol--c0"></span>
								<span class="hidden close button on-right right-margin--x10 symbol--x2 sym-chevron-circle-up symbol--c0"></span>
							</div>
							<div class="folder-content hidden">
								<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="panel-leftside.php"><b>Left</b> Panel</a>
								<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="panel-rightside.php"><b>Right</b> Panel</a>
								<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="panel-doubleside.php"><b>Double</b> Panel</a>
								<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="panel-topside.php"><b>Top</b> Panel</a>
								<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="panel-bottomside.php"><b>Bottom</b> Panel</a>
							</div>
						</div>
						
						<div class="folder">
							<div class="rounded--x5 top-child center-text padding--x10 text--c3">
								<a class="back button on-left left-margin--x10 symbol sym-chevron-left" href="#">&nbsp;</a>
								<span class="symbol sym-bars symbol--c5"></span>
								SWEEP&nbsp;PANEL
								<span class="symbol sym-bars symbol--c5"></span>
								<span class="open button on-right right-margin--x10 symbol--x2 sym-chevron-circle-down symbol--c0"></span>
								<span class="hidden close button on-right right-margin--x10 symbol--x2 sym-chevron-circle-up symbol--c0"></span>
							</div>
							<div class="folder-content hidden">
								<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="panel-sweep-leftside.php"><b>Left</b> Panel with Sweep</a>
								<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="panel-sweep-rightside.php"><b>Right</b> Panel with Sweep</a>
								<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="panel-sweep-topside.php"><b>Top</b> Panel with Sweep</a>
								<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="panel-sweep-bottomside.php"><b>Bottom</b> Panel with Sweep</a>
								<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="panel-sweep-center.php"><b>Center</b> Panel with Sweep</a>
								<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="panel-sweep-vertical-center.php"><b>Vertical</b> Panel using Top</a>
							</div>
						</div>
						
						<div class="folder">
							<div class="rounded--x5 top-child center-text padding--x10 text--c3">
								<a class="back button on-left left-margin--x10 symbol sym-chevron-left" href="#">&nbsp;</a>
								<span class="symbol sym-bars symbol--c5"></span>
								SWEEP
								<span class="symbol sym-bars symbol--c5"></span>
								<span class="open button on-right right-margin--x10 symbol--x2 sym-chevron-circle-down symbol--c0"></span>
								<span class="hidden close button on-right right-margin--x10 symbol--x2 sym-chevron-circle-up symbol--c0"></span>
							</div>
							<div class="folder-content hidden">
								<a class="child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="sweep-chains.php"><b>Inline</b> Panel using Pure Sweep</a>
								<a class="bottom-child border-top ellipsis left-symbol sym-external-link top-padding--x10 bottom-padding--x10 left-padding--x10 background--c0 text--c5 symbol--c4" href="sweep.php"><b>Right</b> Panel using Pure Sweep</a>
							</div>
						</div>
						
						<div class="rounded--x5 bottom-child">
							<div class="on-top-left fit-width fit-height background--c0 opacity--x20"></div>
							<div class="more button center-text padding--x10 text--c3">Load more</div>
						</div>
						
					</div>
					</div>
					
				</div>
				
				<div class="child border-top padding--x10 text--c5" id="footer"></div>
				
			</div>
			</div>
		</div>
		</div>
		
	<script>
	(function(){

		// Appanel is required: then create statusbar at first
		Appanel({
			/**
			 * create status bar and handle messages.
			 */
			ready: function() {
				var $body = $('body'),
					$bar = this.statusbar = $body.append(
						'<!-- status bar -->'+
						'<div id="statusbar" class="fixed on-bottom top-rounded--x5 right-rounded--x5 right-border--x2 top-border--x2 left-border--x2 border--c3" style="z-index:68888; max-width:90%;">'+
						'<div class="top-rounded--x5 right-rounded--x5 right-border--x2 top-border--x2 left-border--x2 border--c5">'+
						'<div id="folder" class="top-rounded--x5 right-rounded--x5 background--c5 right-border--x2 top-border--x2 left-border--x2 border--c3 h5">'+
						'	<span class="open button on-top-left left-padding--x5 symbol sym-arrow-circle-up symbol--c4"></span>'+
						'	<span class="hidden close button on-top-left left-padding--x5 symbol sym-arrow-circle-down symbol--c4"></span>'+
						'	<div class="center-text hidden left-margin--x20" id="status">'+
						'		<div class="padding--x5 smaller">Status:&nbsp;<span id="text"></span></div>'+
						'	</div>'+
						'	<div class="center-text hidden left-margin--x20" id="tip">'+
						'		<div class="padding--x5 smaller">Tip:&nbsp;<span id="text"></span></div>'+
						'	</div>'+
						'	<div id="log">'+
						'		<div id="text" class="hidden foldable scrollable rounded--x5 margin--x5 height--x200 background--c2 top-padding--x30"></div>'+
						'		<span class="on-top-right padding--x10 top-padding--x5 right-margin--x30 upper text--c4 smaller">Appanel Debug Log</span>'+
						'		<span class="on-top-left button bottom-rounded--x15 symbol sym-trash text--c4 background--c5 padding--x10 top-padding--x5" onclick="$(this).parent().find(\'#text\').empty();"><small>&nbsp;CLEAR</small></span>'+
						'	</div>'+
						'</div>'+
						'</div>'+
						'</div>'
					).find('#statusbar').css('z-index',88888);

				// status bar
				this.router.sweep({
					on: 'message:status',
					run: function(e,m) {
						$bar.find('#tip').hide();
						$bar.find('#status').show().find('#text').html(m);
					},
					sweep: [
						
						//-- action: on tip
						{
							on: 'message:tip',
							run: function(e,m) {
								$bar.find('#status').hide();
								$bar.find('#tip').show().find('#text').html(m);
							}
						},

						//-- action: on log
						{
							on: 'message:log',
							count: 0,
							run: function(e,m) {

								// log filter: show only log that contain one or more of below.
								var filter = ['live:'], // 'live:', 'drilldown:', 'folder:'
									show = false;
								for(var f in filter) {
									if(m.search(filter[f]) >= 0) {
										show = true;
										break;
									}
								}
								
								// add log
								if(show) {
									this.count++;
									var $log = $bar.find('#log #text');
									$log
										.append('<div class="rounded--x5 margin--x5 bottom-margin--x10 padding--x5 background--c3">'+this.count+')&nbsp;'+m+'</div>')
										.scrollTop($log.get(0).scrollHeight);
								}
								
							}
						}
						
					]
				});

				// status bar log
				this.statusbar.find('#folder').folder();

				// debug for htmlchanged
				this.router.on('html:changed',function(ev,type) {
					var $element = $(ev.target);
					if(!$element.is('#statusbar #text')) {
						Appanel.th('dev:log','html:changed : '+type+' on '+$element);
					}
				});
				
			}
		});
		
		/*-- options for animation loop --*/
		var css1 = {
				left: '10%',
				fontSize: '0.7em'
			},
			css2 = {
				left: '50%',
				fontSize: '1.5em'
			},
			css3 = {
				left: '90%',
				fontSize: '0.7em'
			},
			play = 3,
			pause = 5,
			defer3 = [{
				duration: pause,
				sweep:[
					/* swap 3 1 2 */
					{
						selector: '#sweep-item-1',
						css: {zIndex:2}
					},
					{
						selector: '#sweep-item-2',
						css: {zIndex:1}
					},
					{
						selector: '#sweep-item-3',
						css: {zIndex:3}
					},
					{
						selector: '#sweep-item-1',
						duration: play,
						csstrans: true,
						css: css3
					},
					{
						selector: '#sweep-item-2',
						duration: play,
						csstrans: true,
						css: css1
					},
					{
						selector: '#sweep-item-3',
						duration: play,
						csstrans: true,
						css: css2,
						defer: [{
							duration: 0.01,
							sweep:['start']
						}]
					}
				]
			}],
			defer2 = [{
				duration: pause,
				sweep:[
					/* swap 2 3 1 */
					{
						selector: '#sweep-item-1',
						css: {zIndex:3}
					},
					{
						selector: '#sweep-item-2',
						css: {zIndex:2}
					},
					{
						selector: '#sweep-item-3',
						css: {zIndex:1}
					},
					{
						selector: '#sweep-item-1',
						duration: play,
						csstrans: true,
						css: css2
					},
					{
						selector: '#sweep-item-2',
						duration: play,
						csstrans: true,
						css: css3
					},
					{
						selector: '#sweep-item-3',
						duration: play,
						csstrans: true,
						css: css1,
						defer: defer3
					}
				]
			}],
			defer1 = [{
				duration: 0.01,		// speed will be changed at the end of first loop.
				sweep:[
					/* swap 1 2 3 */
					{
						selector: '#sweep-item-1',
						css: {zIndex:1}
					},
					{
						selector: '#sweep-item-2',
						css: {zIndex:3}
					},
					{
						selector: '#sweep-item-3',
						css: {zIndex:2}
					},
					{
						selector: '#sweep-item-1',
						duration: play,
						csstrans: true,
						css: css1
					},
					{
						selector: '#sweep-item-2',
						duration: play,
						csstrans: true,
						css: css2
					},
					{
						selector: '#sweep-item-3',
						duration: play,
						csstrans: true,
						css: css3,
						defer: defer2
					}
				]
			}];

		//-- play animation loop
		$('#sweep-item-1').sweep({
			//debug: true,
			inout: {
				// scroller: 'body',		// body is default scroller
				scope: '#sweep-item-scope'	// scope to play
				// margin: -120,			// use default margin (scope-height/3) 
			},
			on: 'sweep:ready',
			duration: 0.01,
			// timing: 'ease-out',				// try to use style named animation-timing-function in chrome to see all possible values
			label: 'start',
			defer: defer1,
			run: function(e){
				// change duration real time during
				if(this.ready==undefined) {
					this.ready = false;
				}else{
					this.ready = true;
					this.defer[0].duration = pause;
					this.run = undefined;
				}
			}
		});
		
		//-- focus on a panel.
		var $panel = $('.panel'),

		//-- options for folders
		folderoptions = {
			foldable: '.folder-content',
			single: true,
			duration: 0.3
		};

		//-- create panel, paneloptions is required
		if(typeof(paneloptions)=='object') {
			$panel
				.panel(paneloptions)			// create hidden panel
				.removeClass('hidden')			// un-hidden panel
				.on('panel:show',function(){
					$('#spot').addClass('rotate--x315');
				})
				.on('panel:hide',function(){
					$('#spot').removeClass('rotate--x315');
				});
		}

		//-- create drilldown, drilldownoptions is required
		if(typeof(drilldownoptions)=='object') {
			$panel.find('.drilldown').drilldown(drilldownoptions);
			if(typeof(folderoptions)=='object') {
				$panel.on('drilldown:live',function(ev){
					var $e = $(ev.target).removeClass('background--c3 opacity--x20').css('min-height','auto');
					folderoptions.context = undefined;
					$e.find('.folder').folder(folderoptions).last().folder('open');
					ev.stopPropagation();
				});
			}
		}

		//-- create folders, foldersoptions is required
		if(typeof(folderoptions)=='object') {

			//-- startup folders
			var $folder = $panel.find('.folder'),
				opacity = 0;
			folderoptions.context = undefined;
			$folder.folder(folderoptions).last().folder('open');

			//-- handle live folder
			$panel.on('folder:live',function(ev){
				var $e = $(ev.target);
				$e.removeClass('background--c3 opacity--x20').css('min-height','auto');
				//folderoptions.context = undefined;
				//$e.find('.folder').folder(folderoptions);
				opacity += 10;
				if(opacity >= 40) {
					$e.find('.folder:first').addClass('hidden');
				}else{
					$e.find('.folder>.on-top-left').addClass('opacity--x'+opacity);
				}
				$e.find('.back').on('click touchstart',function(){
					$panel.find('.drilldown').drilldown('back');
				});
				ev.stopPropagation();
			});

			//-- handle more button
			$('.more').on('click touchstart',function(ev){
				var $folders = $(this).before('<div id="folders" class="background--c3 opacity--x20" style="min-height:100px;">'+Appanel.loading+'</div>').prev();
				$folders.load('live/folders.php',function(ev){
					$folders.removeClass('background--c3 opacity--x20').css('min-height','auto');
					folderoptions.context = $folder;
					$folders.find('.folder').folder(folderoptions);
					$folders.find('.back').on('click touchstart',function(){
						$panel.find('.drilldown').drilldown('back');
					});
				});
			});
			
		}

	})();
	
	</script>