<?php 
/* wait time simulation */
for($i=1; $i<90000; $i++) {
	$sim = ($i * 99999 ).' decimal '.($i * $i);
}
?>

	<div class="rounded--x5 top-child center-text padding--x10 text--c3">
		<a class="back button on-left left-margin--x10 symbol sym-chevron-left" href="#">&nbsp;</a>
		<span class="symbol sym-bars symbol--c5"></span>		
		Live Content
		<span class="symbol sym-bars symbol--c5"></span>
		<a class="home button on-right right-margin--x10 symbol sym-home" href="#">&nbsp;</a>
	</div>
	
	<div class="child border-top padding--x10 text--c5 left-symbol--x2 sym-check">
		This is live content that loaded from sub-panel.php
	</div>
	
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
					<div class="live inner shadow rounded--x5 h6 margin--x10 background--c4" src="live/sub-panel.php">
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
			
		</div>
		</div>
		
	</div>
	
	<div class="child border-top padding--x10 text--c5 left-symbol sym-info-circle">
		click home button to go back to first level, click back button to go back 1 level.
	</div>
		
